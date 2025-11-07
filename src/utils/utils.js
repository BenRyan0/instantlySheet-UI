// socket.js
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";

// Safe token decoding
function getUserInfo() {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch (err) {
    console.warn("Invalid or expired token:", err.message);
    return null;
  }
}

// Persistent client UUID generator
function getClientUUID() {
  let id = localStorage.getItem("client_uuid");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("client_uuid", id);
  }
  return id;
}

const userInfo = getUserInfo();
const clientId = getClientUUID();
const userId = userInfo?.id || null;

// Only initialize socket if we have a valid user
export const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:9000", {
  auth: { userId, clientId },
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 10000,
});

// Connection event handlers
socket.on("connect", () => {
  console.log(`[SOCKET] Connected → ID: ${socket.id}`);
  console.log(`[SOCKET] User: ${userId}, Client: ${clientId}`);
});

socket.on("disconnect", (reason) => {
  console.warn(`[SOCKET] Disconnected → Reason: ${reason}`);
});

socket.on("connect_error", (err) => {
  console.error(`[SOCKET] Connection error: ${err.message}`);
});

// Optional: Helper to safely emit events
export function emitSocket(event, data) {
  if (socket.connected) {
    socket.emit(event, data);
  } else {
    console.warn(`[SOCKET] Cannot emit '${event}' — socket not connected`);
  }
}
