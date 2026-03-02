# Real-Time Collaborative Editor Engine

## 🚀 Overview

A high-performance, real-time collaborative text editor (similar to Google Docs or Notion) that allows multiple users to edit the same document simultaneously without data corruption.

This project tackles the classic distributed systems problem of **concurrent state synchronization**. It is designed to handle network latency, out-of-order packet delivery, and horizontal scaling across multiple server instances.

## 🧠 The Core Problem Solved

If User A and User B type at the exact same millisecond, standard CRUD operations will result in race conditions and document corruption (e.g., the "Last Write Wins" problem).

This engine solves this by abandoning traditional database locks and implementing **CRDTs (Conflict-free Replicated Data Types)** via the `Yjs` library. This mathematically guarantees that all clients eventually converge to the exact same document state, regardless of the order in which the server receives their edits.

## 🏗️ System Architecture

1. **Client Layer (React.js & Quill/Tiptap):** Renders the text editor and captures user keystrokes as mathematical operations, not raw text.
2. **Transport Layer (WebSockets / Socket.io):** Maintains persistent, low-latency bi-directional connections between the clients and the server.
3. **Application Layer (Node.js & Express):** Broadcasts the CRDT operations to all connected clients in a specific document "room."
4. **Scaling Layer (Redis Pub/Sub):** Allows the system to scale horizontally. If User A is on Server 1 and User B is on Server 2, Redis securely routes the WebSocket messages between the two distinct Node.js processes.

## 🛠️ Key Technical Concepts Demonstrated

- **Real-time Bi-directional Streaming:** Efficiently managing thousands of open WebSocket connections.
- **Operational Transformation / CRDTs:** Resolving concurrent data conflicts at the mathematical level without locking the database.
- **Distributed Pub/Sub:** Using Redis to decouple WebSocket servers and allow horizontal scaling.
- **In-Memory State Caching:** Storing the active document state in memory for $O(1)$ read/write speeds, periodically flushing to persistent storage.

## 💻 Tech Stack

- **Frontend:** React.js, Tailwind CSS, Quill.js (or Tiptap), Yjs
- **Backend:** Node.js, Express.js, Socket.io (or `ws`), y-websocket
- **Infrastructure:** Redis (Pub/Sub & In-Memory Caching)
