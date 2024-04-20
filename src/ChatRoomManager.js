const ChatRoom = require('./ChatRoom');

 class ChatRoomManager {
    static #instance;
    #chatRooms;
  
    constructor() {
      if (ChatRoomManager.#instance) {
        return ChatRoomManager.#instance;
      }
      this.#chatRooms = new Map();
      ChatRoomManager.#instance = this;
    }
  
    createRoom(roomId) {
      if (!this.#chatRooms.has(roomId)) {
        this.#chatRooms.set(roomId, new ChatRoom(roomId));
      }
      return this.#chatRooms.get(roomId);
    }
  
    getRoom(roomId) {
      return this.#chatRooms.get(roomId);
    }
  }

  
module.exports = ChatRoomManager;

  