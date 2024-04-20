class ChatRoom {
  constructor(roomId) {
    this.roomId = roomId;
    this.users = {};
    this.messages = [];
  }

  addUser(user) {
    this.users[user.id] = user;
  }

  getUserById(id) {
    return this.users[id];
  }

  getUserByUsername(username) {
    return Object.values(this.users).find(user => user.username === username);
  }

  removeUserById(id) {
    delete this.users[id];
  }

  addMessage(message) {
    this.messages.push(message);
  }

  getAllMessages() {
    return this.messages;
  }
}

module.exports = ChatRoom;
