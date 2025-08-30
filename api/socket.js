const { Server } = require("socket.io");
const mongoose = require("mongoose");
const Message = require("./models/MessageModel");
const User = require("./models/UserModel");

function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_ORIGIN,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    // Authenticate user (optional: JWT)
    // socket.handshake.auth.token

    // Join user to their own room for private messaging
    socket.on("join", (userId) => {
      socket.join(userId);
    });

    // Listen for new messages
    socket.on("sendMessage", async (msg) => {
  // msg: { sender, receiver, content, relatedOrder }
      try {
        // Validate sender and receiver
        if (!msg.sender || !msg.receiver || !msg.content) return;

        // Save message to DB
        const message = await Message.create({
          sender: new mongoose.Types.ObjectId(msg.sender),
          receiver: new mongoose.Types.ObjectId(msg.receiver),
          content: msg.content,
          relatedOrder: msg.relatedOrder ? new mongoose.Types.ObjectId(msg.relatedOrder) : undefined,
        });

        // Populate sender and receiver for frontend
        const populatedMessage = await Message.findById(message._id)
          .populate("sender", "_id name role")
          .populate("receiver", "_id name role");

        // Emit to both receiver's and sender's rooms
        io.to(msg.receiver).emit("receiveMessage", populatedMessage);
        io.to(msg.sender).emit("receiveMessage", populatedMessage);
        } catch (err) {
          console.error("Socket message error:", err);
        }
    });

    // Add more events as needed (read receipts, typing, etc.)
  });

  return io;
}

module.exports = setupSocket;
