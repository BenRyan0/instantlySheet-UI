// socket.js
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";

// ====================================================
// Helpers: User & Client Identity
// ====================================================

function getUserInfo() {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      console.warn("[SOCKET] Token expired");
      return null;
    }
    return decoded;
  } catch (err) {
    console.warn("[SOCKET] Invalid token:", err.message);
    return null;
  }
}

function getClientUUID() {
  let id = localStorage.getItem("client_uuid");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("client_uuid", id);
  }
  return id;
}

// ====================================================
// 🌐 Environment Setup
// ====================================================

const SOCKET_URL = (
  import.meta.env.VITE_MODE === "prod"
    ? import.meta.env.VITE_SOCKET_URL
    : import.meta.env.VITE_SOCKET_URL_LOCAL || "http://localhost:9000"
).replace(/\/+$/, ""); // remove trailing slashes for CORS safety

const clientId = getClientUUID();
const initialUser = getUserInfo();

// ====================================================
// Socket Initialization
// ====================================================

export const socket = io(SOCKET_URL, {
  autoConnect: false, // we'll control connect manually
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1500,
  timeout: 10000,
  transports: ["websocket", "polling"],
});

// ====================================================
// Connection Control
// ====================================================

let isConnecting = false;

/**
 * Connect socket with user authentication
 */
export function connectSocket() {
  const user = getUserInfo();
  if (!user?.id) {
    console.warn("[SOCKET] Cannot connect — no valid user token");
    return;
  }

  if (socket.connected || isConnecting) {
    console.log("[SOCKET] Already connected or connecting...");
    return;
  }

  isConnecting = true;
  socket.auth = { userId: user.id, clientId };

  console.log("[SOCKET] Connecting to server...");
  socket.connect();
}

/**
 * Disconnect the socket manually
 */
export function disconnectSocket() {
  if (socket.connected) {
    socket.disconnect();
    console.log("[SOCKET] Disconnected manually");
  }
}

/**
 * Refresh authentication (e.g., on token refresh or re-login)
 */
export function refreshSocketAuth(newToken) {
  try {
    const decoded = jwtDecode(newToken);
    socket.auth = { userId: decoded.id, clientId };
    console.log("[SOCKET] Auth refreshed");
    if (socket.connected) {
      socket.emit("refresh_auth", socket.auth);
    } else {
      connectSocket();
    }
  } catch (err) {
    console.error("[SOCKET] Invalid new token:", err.message);
  }
}

// ====================================================
// Event Handlers
// ====================================================

socket.on("connect", () => {
  isConnecting = false;
  console.log(`[SOCKET] Connected (${socket.id})`);
  console.log(`[SOCKET] User: ${socket.auth?.userId}, Client: ${clientId}`);
});

socket.on("disconnect", (reason) => {
  isConnecting = false;
  console.warn(`[SOCKET] Disconnected → ${reason}`);

  // Avoid infinite loops from server rejections
  if (reason === "io server disconnect") {
    console.log("[SOCKET] Attempting reconnection in 2s...");
    setTimeout(() => {
      const user = getUserInfo();
      if (user?.id) connectSocket();
    }, 2000);
  }
});

socket.on("connect_error", (err) => {
  isConnecting = false;
  console.error(`[SOCKET] Connection error: ${err.message}`);
});

// ====================================================
// Safe Emit Helper with Queue
// ====================================================

let pendingQueue = [];

export function emitSocket(event, data) {
  if (socket.connected) {
    socket.emit(event, data);
  } else {
    console.warn(`[SOCKET] Queued emit '${event}' — socket not connected`);
    pendingQueue.push({ event, data });
  }
}

// Flush queue when reconnected
socket.on("connect", () => {
  if (pendingQueue.length) {
    console.log(`[SOCKET] Flushing ${pendingQueue.length} queued emits`);
    pendingQueue.forEach(({ event, data }) => socket.emit(event, data));
    pendingQueue = [];
  }
});

// ====================================================
// Lazy Auto-Connect (Safe)
// ====================================================

// Only auto-connect if explicitly desired — avoids race conditions
if (initialUser?.id) {
  console.log("[SOCKET] Auto-connect: scheduling initial connect...");
  setTimeout(() => {
    connectSocket();
  }, 500);
}
