// "use" imports. axum crate -> extract module -> Path type

// web framework for building HTTP servers
use axum::{
    // Path: extracts URL path params
    // State: access shared app state (databases)
    // WebSocketUpgrade: used to upgrade HTTP connection to WebSocket
    extract::{Path, State, WebSocketUpgrade},

    // used for HTTP status codes like (200 OK)
    http::StatusCode,

    // response: used to convert data into HTTP responses
    // Json: wrapper that auto-serializes JSON responses
    response::{IntoResponse, Json},

    // get/post: route handlers for HTTP
    routing::{get, post},

    // maps URLs to handler functions (main router)
    Router,
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