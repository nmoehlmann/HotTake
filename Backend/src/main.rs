// "use" imports. axum crate -> extract module -> Path type

// web framework for building HTTP servers
use axum::{
    // Path: extracts URL path params
    // State: access shared app state (databases)
    extract::{Path, State},

    // used for HTTP status codes like (200 OK)
    http::StatusCode,

    // response: used to convert data into HTTP responses
    // Json: wrapper that auto-serializes JSON responses
    response::{IntoResponse, Json},

    // get/post: route handlers for HTTP
    routing::{get, post},

    // maps URLs to handler functions (main router)
    Router,

    // WebSocketUpgrade: used to upgrade HTTP connection to WebSocket
    extract::ws::WebSocketUpgrade,
};

// serializing / deserializing data (JSON specifically)
use serde::{Deserialize, Serialize};

// standard namespace like C++
use std::{
    collections::HashMap,

    // Arc: "Atomically Reference Counted" - allows multiple owners of same data
    // Mutex: "Mutual Exclusion" - ensures only one tread can access data at a time
    // Arc<Mutex<T>> - together allows safe sharing of mutable data between threads
    sync::{Arc, Mutex},
};

// Async runtime for concurrent operations
// TcpListener: listens to incoming TCP connections (HTTP requests)
use tokio::net::TcpListener;

// for CORS specifically
// CORS allows web browser to make requests from different domains
use tower_http::cors::CorsLayer;

// makes generating unique IDs easier
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
struct User {
    id: String,
    name: String,
    age: u32,
    gender: String
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct JoinDebateRequest {
    user_id: String,
    user_name: String,
    user_age: u32,
    user_gender: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct LeaveDebateRequest {
    user_id: String,
}

// derive basically implements certain features that you would otherwise have to code yourself, for example
// - Debug: allows you to print debate if its initialized
// - Clone: allows you to use the clone method on it
#[derive(Debug, Clone, Serialize, Deserialize)]
struct Debate {
    id: String,
    title: String,
    created_at: String,
    is_active: bool,
    owner_id: String,
    participants: HashMap<String, User>,
}

#[derive(Debug, Deserialize)]
struct CreateDebateRequest {
    title: String,
    owner_id: String,
    owner_name: String,
    owner_age: u32,
    owner_gender: String,
}

const MAX_PARTICIPANTS: u32 = 6;

// App state shared between all requests
// Regular HashMap wont work because web servers handle many requests simultaneously which becomes a problem because Rust's safety rules prevent sharing mutable data between threads

// Mutex: allows thread-safe access control of debates
// Arc: allows multiple threads ownership to debates
type DebatesState = Arc<Mutex<HashMap<String, Debate>>>;
type UsersState = Arc<Mutex<HashMap<String, User>>>;

struct AppState {
    debates: DebatesState,
    users: UsersState,
}

// "#[]" is called an attribute which gives instructions to the Rust compiler about how to handle the code that follows
#[tokio::main]
async fn main() {
    println!("Starting HotTake Rust Server");

    // create the shared state for storing debates
    let app_state = Arc::new(AppState {
        debates: Arc::new(Mutex::new(HashMap::new())),
        users: Arc::new(Mutex::new(HashMap::new())),
    });

    // mock debates for testing
    add_mock_debates(&app_state);

    // build app routes
    let app = Router::new()
        // health check
        .route("/", get(health_check))

        // REST API routes
        .route("/api/debates", get(get_debates))
        .route("/api/debates", post(create_debate))
        .route("/api/debates/:id", get(get_debate))
        .route("/api/debates/:id/join", post(join_debate))
        .route("/api/debates/:id/leave", post(leave_debate))

        // WebSocket for signaling (todo)
        .route("/ws/signaling/:debate_id", get(websocket_handler))

        // Add CORS middleware for frontend
        .layer(CorsLayer::permissive())

        // pass shared state to all handlers
        .with_state(Arc::clone(&app_state));

    let listener = TcpListener::bind("127.0.0.1:3000").await.unwrap();
    println!("Server running on http://127.0.0.1:3000");

    axum::serve(listener, app).await.unwrap();
}

async fn health_check() -> &'static str {
    "HotTake API is running"
}

// gets all debates

// directly getting debates doesn't work because Axum does not know where to get debates from
// Axum is calling this function, which means it needs to know exactly where the params are coming from hence (State(...))
// State: an Axum extractor struct that tell Axum "get this from the literal stored app state, not from the HTTP request"
async fn get_debates(State(state): State<Arc<AppState>>) -> Json<Vec<Debate>> {
    let debates_map = state.debates.lock().unwrap();
    let debates_list: Vec<Debate> = debates_map.values().cloned().collect();
    return Json(debates_list);
}

async fn get_debate(
    Path(id): Path<String>,
    State(state): State<Arc<AppState>>,
) -> Result<Json<Debate>, StatusCode> {
    //lock(): blocks other threads from accessing
    //unwrap(): lock returns a Result object and unwrap extracts the success value from the Result
    let debates_map = state.debates.lock().unwrap();
    match debates_map.get(&id) {
        Some(debate) => Ok(Json(debate.clone())),
        None => Err(StatusCode::NOT_FOUND),
    }
}

async fn create_debate(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<CreateDebateRequest>,
) -> Result<Json<Debate>, StatusCode> {

    // create owner user
    let owner = User {
        id: payload.owner_id.clone(),
        name: payload.owner_name,
        age: payload.owner_age,
        gender: payload.owner_gender,
    };

    // add owner to users map
    {
        let mut users_map = state.users.lock().unwrap();
        users_map.insert(owner.id.clone(), owner.clone());
    }

    // create new debate with owner as first participant
    let id = Uuid::new_v4().to_string();
    let mut participants = HashMap::new();
    participants.insert(owner.id.clone(), owner);

    let debate = Debate {
        id: id.clone(),
        title: payload.title.trim().to_string(),
        created_at: chrono::Utc::now().to_rfc3339(),
        is_active: true,
        owner_id: payload.owner_id,
        participants,
    };

    // add to storage
    {
        let mut debates_map = state.debates.lock().unwrap();
        debates_map.insert(id.clone(), debate.clone());
    }

    println!("Created debate: {} {}", debate.title, debate.id);
    return Ok(Json(debate));
}

// join debate
async fn join_debate(
    Path(id): Path<String>,
    State(state): State<Arc<AppState>>,
    Json(join_req): Json<JoinDebateRequest>,
) -> Result<Json<Debate>, StatusCode> {
    let mut debates_map = state.debates.lock().unwrap();

    // match is a type-safe if condition that either returns successful (Some("name of returned obj") =>) or failure (None =>)
    match debates_map.get_mut(&id) {
        Some(debate) => {
            if debate.participants.len() as u32 >= MAX_PARTICIPANTS {
                return Err(StatusCode::CONFLICT); // debate is full
            }

            // create user object
            let user = User {
                id: join_req.user_id.clone(),
                name: join_req.user_name,
                age: join_req.user_age,
                gender: join_req.user_gender,
            };

            // add user to users map
            {
                let mut users_map = state.users.lock().unwrap();
                users_map.insert(user.id.clone(), user.clone());
            }

            // add user to debate participants
            debate.participants.insert(user.id.clone(), user);

            println!("User joined debate: {} {}", debate.title, debate.id);
            Ok(Json(debate.clone()))
        }
        None => Err(StatusCode::NOT_FOUND),
    }
}

async fn leave_debate(
    Path(id): Path<String>,
    State(state): State<Arc<AppState>>,
    Json(leave_req): Json<LeaveDebateRequest>,
) -> Result<Json<Debate>, StatusCode> {
    let mut debates_map = state.debates.lock().unwrap();

    match debates_map.get_mut(&id) {
        Some(debate) => {
            // remove user from participants
            if debate.participants.remove(&leave_req.user_id).is_some() {
                println!("User {} left debate: {}", leave_req.user_id, debate.id);
                Ok(Json(debate.clone()))
            } else {
                // user wasn't in this debate
                Err(StatusCode::BAD_REQUEST)
            }
        }
        None => Err(StatusCode::NOT_FOUND),
    }
}

// WebSocket handler
async fn websocket_handler(
    Path(debate_id): Path<String>,
    ws: WebSocketUpgrade,
    State(state): State<Arc<AppState>>,
    // impl: allows return of any type that implements (IntoResponse) in this case
) -> impl IntoResponse {
    println!("WebSocket connection request for debate: {}", debate_id);

    // accept connection for now
    ws.on_upgrade(move |socket| handle_socket(socket, debate_id, state))
}

async fn handle_socket(socket: axum::extract::ws::WebSocket, debate_id: String, state: Arc<AppState>) {

    println!("WebSocket connection established for debate: {}", debate_id);

    // TODO: implement webrtc signaling here
}

// adds mock debates for testing
fn add_mock_debates(state: &Arc<AppState>) {
    let mut debates_map = state.debates.lock().unwrap();
    let mut users_map = state.users.lock().unwrap();
    
    // Create some mock users
    let user1 = User {
        id: "user1".to_string(),
        name: "John Doe".to_string(),
        age: 25,
        gender: "Male".to_string(),
    };
    
    let user2 = User {
        id: "user2".to_string(),
        name: "Jane Smith".to_string(),
        age: 30,
        gender: "Female".to_string(),
    };
    
    // Add users to users map
    users_map.insert(user1.id.clone(), user1.clone());
    users_map.insert(user2.id.clone(), user2.clone());
    
    // Create mock debates with participants
    let mut participants1 = HashMap::new();
    participants1.insert(user1.id.clone(), user1.clone());
    participants1.insert(user2.id.clone(), user2.clone());
    
    let mut participants2 = HashMap::new();
    
    let mock_debates = vec![
        Debate {
            id: "1".to_string(),
            title: "poopy or moopy?".to_string(),
            created_at: chrono::Utc::now().to_rfc3339(),
            is_active: true,
            owner_id: "user1".to_string(),
            participants: participants1,
        },
        Debate {
            id: "2".to_string(),
            title: "is my weewee too small or no?".to_string(),
            created_at: chrono::Utc::now().to_rfc3339(),
            is_active: true,
            owner_id: "user2".to_string(),
            participants: participants2,
        },
    ];

    for debate in mock_debates {
        debates_map.insert(debate.id.clone(), debate);
    }
}