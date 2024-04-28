import { io } from "socket.io-client";

// Define the connection URL and any necessary options
const socket = io("http://localhost:4000", {
  path: "/socket.io",
});

socket.on("connect", () => {
  console.log("Connected to the server!");
  socket.emit("hello", { message: "Hello from client 1!" });
});

//After connecting, a client might send a request to join a specific room:
socket.emit("joinRoom", { roomName: "chatroom1" });
//Clients can send messages to the room they have joined, which the server can then broadcast to other members of the room:
socket.emit("sendMessage", { room: "chatroom1", message: "Hi everyone I am Client 1!" });
//Receive Messages:
//Ensure the client listens for messages broadcasted by the server to the room:
socket.on("roomMessage", (message) => {
  console.log(message);
});

// Listening for messages from the server
socket.on("receiveMessage", (data) => {
  console.log(`Message from ${data.senderId}: ${data.message} ${data.time}`);
});
socket.on("welcome", (data: any) => {
  console.log("Received message from server:", data);
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

socket.on("connect_error", (error: Error) => {
  console.error("Connection failed:", error);
});
