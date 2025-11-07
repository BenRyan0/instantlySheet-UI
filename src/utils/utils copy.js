// socket.js
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";


const token = localStorage.getItem("accessToken")
const userinfo = jwtDecode(token);
console.log("-----------------------")
console.log(userinfo)
console.log("-----------------------")

// Generate or reuse a persistent browser ID
function getClientUUID() {
  let id = localStorage.getItem("client_uuid");
  if (!id) {
    id = crypto.randomUUID(); // generates a stable UUID
    localStorage.setItem("client_uuid", id);
  }
  return id;
}

const clientId = getClientUUID();

// Get the userId (from login, JWT decode, or localStorage)
const userId = userinfo.id // You can set this after login

// Initialize socket with both IDs
export const socket = io("http://localhost:9000", {
  auth: {
    userId,
    clientId,
  },
});

// Optional connection listeners
socket.on("connect", () => {
  console.log("Socket connected");
  console.log("socket.id:", socket.id);
  console.log("userId:", userId);
  console.log("clientId:", clientId);
});

socket.on("disconnect", (reason) => {
  console.log("Socket disconnected:", reason);
});







// export const socket = io('http://localhost:8184')


