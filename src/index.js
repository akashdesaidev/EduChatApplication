const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const ChatRoomManager = require("./ChatRoomManager");
const User = require("./User");
const WebSocketAdapter = require("./WebSocketAdapter");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);


const observer = new WebSocketAdapter(io);
const chatManager = new ChatRoomManager();

io.on("connection", (socket) => {
  console.log("a user connected");

  let currentRoom = null;
  let currentUser = null;

  socket.on("join", (data) => {
   
    try {
      const { roomId, username } = data;

      if (!roomId || !username) {
        throw new Error("Invalid data");
      }

      currentRoom = chatManager.createRoom(roomId);

      const existingUser = currentRoom.getUserByUsername(username);

      if (existingUser) {
        existingUser.socketId = socket.id;
        currentUser = existingUser;
      } else {
        currentUser = new User(socket.id, username, socket.id);
        currentRoom.addUser(currentUser);
      }

      socket.join(roomId);
      socket.emit("Joined", { text: `Welcome to room ${roomId}` });

      const users = Object.values(currentRoom.users).map((u) => u.username);
      const AllMessages = currentRoom.getAllMessages();
      observer.update({
        socket,
        event: "userJoined",
        roomId,
        username: currentUser.username,
        users,
        message: AllMessages,
      });
    } catch (error) {
      console.error("Error joining room:", error.message);
      socket.emit("error", { message: "Error joining room" });
    }
  });

  socket.on("sendMessage", (data) => {
    try {
      if (currentRoom && currentUser) {
        currentRoom.addMessage({
          username: currentUser.username,
          message: data.message,
        });

        const AllMessages = currentRoom.getAllMessages();
        
        observer.update({
          event: "messageReceived",
          roomId: currentRoom.roomId,
          message: AllMessages,
          username: currentUser.username,
        });
      }
    } catch (error) {
      console.error("Error sending message:", error.message);
      socket.emit("error", { message: "Error sending message" });
    }
  });

  socket.on("disconnect", () => {
    try {
      if (currentRoom && currentUser) {
        currentRoom.removeUserById(currentUser.id);
        const users = Object.values(currentRoom.users).map((u) => u.username);

        observer.update({
          event: "userLeft",
          roomId: currentRoom.roomId,
          username: currentUser.username,
          users,
        });
      }
    } catch (error) {
      console.error("Error disconnecting user:", error.message);
    }
  });
});

app.use(express.static(path.resolve("public")));

app.get("/", (req, res) => {
  return res.sendFile(path.join(__dirname, "/public/index.html"));
});

server.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
