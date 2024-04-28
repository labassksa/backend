import { io } from "socket.io-client";

const socket = io("http://localhost:4000", {
  path: "/socket.io",
});

socket.on("connect", () => {
  console.log("Connected to the server!");
  socket.emit("joinRoom", { room: "chatroom1" });
  socket.emit("hello", { message: "Hello from client 2!" });
});

socket.on("welcome", (data: any) => {
  console.log("Received message from server:", data);
});
// Listening for messages from the server
socket.on("receiveMessage", (data) => {
  console.log(
    `Message from ${data.senderId}: At: ${data.time} ${data.message}`
  );
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

socket.on("connect_error", (error: Error) => {
  console.error("Connection failed:", error);
});
