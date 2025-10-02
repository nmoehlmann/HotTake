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

// App state shared between all requests
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