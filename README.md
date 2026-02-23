# 🛡️ Distributed Rate Limiter Ecosystem
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)

A high-performance, production-ready Rate Limiting system designed for distributed environments. This project showcases the implementation of two different algorithms to handle API traffic spikes effectively.

---

## 📐 System Architecture
> **Note:** Below is the logical flow of the system. I designed this to be stateless, allowing it to scale across multiple server instances effortlessly.

![System Architecture](./path-to-your-excalidraw-image.png)

---

## 🚀 Featured Algorithms

### 🟢 1. Fixed Window (Efficiency First)
Designed for high-speed traffic management where memory optimization is key.
* **How it works:** Uses a simple counter mapped to a time window.
* **Key Tech:** `INCR` & `EXPIRE`.
* **Use Case:** General API protection (e.g., Search or Data fetch).

### 🔵 2. Floating Window (Precision First)
A sophisticated "Sliding Window Log" that prevents burst traffic at the edge of windows.
* **How it works:** Uses Redis Sorted Sets to track every request's unique timestamp.
* **Key Tech:** `ZSET` (`ZADD`, `ZREMRANGEBYSCORE`).
* **Use Case:** Sensitive events like **In-app Notifications** or OTP requests.

---

## 🛠️ Key Technical Implementations

### 🧠 Distributed State Management
Unlike local memory limiting, this project connects multiple Express instances to a single **Redis cluster**. This ensures that if a user is limited on *Server A*, they are automatically limited on *Server B* as well.

### ⚡ Atomic Operations
By utilizing Redis native commands like `INCR`, we eliminate **Race Conditions**. This ensures the counter remains accurate even if thousands of requests hit the server in the same millisecond.

### 🛡️ Fail-Open Strategy
The middleware is wrapped in `try-catch` blocks. If the Redis connection fails, the system defaults to `next()`, ensuring the API remains accessible even if the cache layer is down.

---

## 📂 Project Structure
```text
├── server
         ├──server.js           # Main Express application
├── client
         ├── client.js            # Redis client configuration
├── middelWear
         ├── redisMiddelWear.js   # Fixed & Floating logic implementation
└── README.md           # Documentation.

### ⚡ How to Run

Start Redis: docker run -p 6379:6379 -d redis

Install Deps: npm install

Run App: cd server
        node server.js