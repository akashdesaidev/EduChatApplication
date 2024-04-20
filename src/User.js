const Message = require("./Message");
class User {
  constructor(id, username) {
    this.id = id;
    this.username = username;
  }

  sendMessage(chatRoom, messageContent) {
    const message = new Message(this.username, messageContent);
    chatRoom.sendMessage(message);
  }
  
}

module.exports = User;
