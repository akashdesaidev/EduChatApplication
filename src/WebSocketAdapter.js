const { ObserverInterface } = require("./Observer");

class WebSocketAdapter extends ObserverInterface {
  constructor(io, chatManager) {
    super();
    this.io = io;
    this.chatManager = chatManager;
  }

  update(data) {
    const { socket, event, roomId, message, username, users } = data;

    switch (event) {
      case "userJoined":
        socket.broadcast.to(roomId).emit("userJoined", { username });
        this.io.to(roomId).emit("ActiveUsers", { users });
        this.io.to(roomId).emit("messageReceived", { message, username });
        break;
      case "messageReceived":
        this.io.to(roomId).emit("messageReceived", { message });
        break;
      case "userLeft":
        this.io.to(roomId).emit("userLeft", { username, users });
        this.io.to(roomId).emit("ActiveUsers", { users });
        break;
      default:
        break;
    }
  }
}

module.exports = WebSocketAdapter;
