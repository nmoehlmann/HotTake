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

// derive basically implements certain features that you would otherwise have to code yourself, for example
// - Debug: allows you to print debate if its initialized
// - Clone: allows you to use the clone method on it
#[derive(Debug, Clone, Serialize, Deserialize)]
struct Debate {
    id: String,
    title: String,
    participant_count: u32,
    created_at: String,
    is_active: bool,
}

#[derive(Debug, Deserialize)]
struct CreateDebateRequest {
    title: String,
}

// has to be same type as participant_count for comparison
const MAX_PARTICIPANTS: u32 = 6;

// App state shared between all requests
// Regular HashMap wont work because web servers handle many requests simultaneously which becomes a problem because Rust's safety rules prevent sharing mutable data between threads

// Mutex: allows thread-safe access control of debates
// Arc: allows multiple threads ownership to debates
type AppState = Arc<Mutex<HashMap<String, Debate>>>;

// "#[]" is called an attribute which gives instructions to the Rust compiler about how to handle the code that follows
#[tokio::main]
async fn main() {
    println!("Starting HotTake Rust Server");

    // create the shared state for storing debates
    let debates: AppState = Arc::new(Mutex::new(HashMap::new()));

    // mock debates for testing
    add_mock_debates(&debates);

    // build app routes
    let app = Router::new()
        // health check
        .route("/", get(health_check))

        // REST API routes
        .route("/api/debates", get(get_debates))
        .route("/api/debates", post(create_debate))
        .route("/api/debates/:id", get(get_debate))
        .route("/api/debates/:id/join", post(join_debate))

        // WebSocket for signaling (todo)
        .route("/ws/signaling/:debate_id", get(websocket_handler))

        // Add CORS middleware for frontend
        .layer(CorsLayer::permissive())

        // pass shared state to all handlers
        .with_state(debates);

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
async fn get_debates(State(debates): State<AppState>) -> Json<Vec<Debate>> {
    let debates_map = debates.lock().unwrap();
    let debates_list: Vec<Debate> = debates_map.values().cloned().collect();
    return Json(debates_list);
}

async fn get_debate(
    Path(id): Path<String>,
    State(debates): State<AppState>,
) -> Result<Json<Debate>, StatusCode> {
    //lock(): blocks other threads from accessing
    //unwrap(): lock returns a Result object and unwrap extracts the success value from the Result
    let debates_map = debates.lock().unwrap();
    match debates_map.get(&id) {
        Some(debate) => Ok(Json(debate.clone())),
        None => Err(StatusCode::NOT_FOUND),
    }
}

async fn create_debate(
    State(debates): State<AppState>,
    Json(payload): Json<CreateDebateRequest>,
) -> Result<Json<Debate>, StatusCode> {
    // validate input first
    if payload.title.trim().is_empty() {
        return Err(StatusCode::BAD_REQUEST);
    }

    // create new debate
    let id = Uuid::new_v4().to_string();
    let debate = Debate {
        id: id.clone(),
        title: payload.title.trim().to_string(),
        participant_count: 0,
        created_at: chrono::Utc::now().to_rfc3339(),
        is_active: true,
    };

    // add to storage
    {
        let mut debates_map = debates.lock().unwrap();
        debates_map.insert(id.clone(), debate.clone());
    }

    println!("Created debate: {} {}", debate.title, debate.id);
    return Ok(Json(debate));
}

// join debate
async fn join_debate(
    Path(id): Path<String>,
    State(debates): State<AppState>,
) -> Result<Json<Debate>, StatusCode> {
    let mut debates_map = debates.lock().unwrap();
    // match is a type-safe if condition that either returns successful (Some("name of returned obj") =>) or failure (None =>)
    match debates_map.get_mut(&id) {
        Some(debate) => {
            if debate.participant_count >= MAX_PARTICIPANTS {
                return Err(StatusCode::CONFLICT); // debate is full
            }
            debate.participant_count += 1;
            println!("User joined debate: {} {}", debate.title, debate.id);
            Ok(Json(debate.clone()))
        }
        None => Err(StatusCode::NOT_FOUND),
    }
}

// WebSocket handler
async fn websocket_handler(
    Path(debate_id): Path<String>,
    ws: WebSocketUpgrade,
    // impl: allows return of any type that implements (IntoResponse) in this case
) -> impl IntoResponse {
    println!("WebSocket connection request for debate: {}", debate_id);

    // TODO: implement webrtc signaling
}

fn add_mock_debates(debates: &AppState) {
    let mut debates_map = debates.lock().unwrap();

    let mock_debates = vec![
        Debate {
            id: "1".to_string(),
            title: "poopy or moopy?".to_string(),
            participant_count: 2,
            created_at: chrono::Utc::now().to_rfc3339(),
            is_active: true,
        },
        Debate {
            id: "2".to_string(),
            title: "is my weewee too small or no?".to_string(),
            participant_count: 0,
            created_at: chrono::Utc::now().to_rfc3339(),
            is_active: true,
        },
    ];

    for debate in mock_debates {
        debates_map.insert(debate.id.clone(), debate);
    }
}