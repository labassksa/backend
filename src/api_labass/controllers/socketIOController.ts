import { Server as SocketIO } from "socket.io";
import AppDataSource from "../../configuration/ormconfig";
import { ChatMessage } from "../models/chatMessage"; // Assuming the ChatMessage entity is exported from entities folder

export function initializeSocket(io: SocketIO) {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on(
      "sendMessage",
      async ({ room, message, consultationId, senderId }) => {
        const chatMessageRepository = AppDataSource.getRepository(ChatMessage);

        try {
          const chatMessage = new ChatMessage();
          chatMessage.senderId = 1; // Assuming senderId is passed from the client or derived from session
          chatMessage.receiverId = 2; // Assuming senderId is passed from the client or derived from session
          chatMessage.consultationId = 1;
          chatMessage.message = message;
          chatMessage.createdAt = new Date()

          // Save the message to the PostgreSQL database
          await chatMessageRepository.save(chatMessage);

          // Emit the message to other users in the room
          socket.to(room).emit("receiveMessage", {
            message: chatMessage.message,
            senderId: chatMessage.senderId,
            consultationId: chatMessage.consultationId,
            time: chatMessage.createdAt.toLocaleTimeString(),
          });
        } catch (error) {
          console.error("Error saving message:", error);
          socket.emit("error", { message: "Failed to save message" });
        }
      }
    );

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
}
