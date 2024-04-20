class Observer {
  #observers = [];
  
  addObserver(observer) {
    this.#observers.push(observer);
  }
  
  removeObserver(observer) {
    const index = this.#observers.indexOf(observer);
    if (index > -1) {
      this.#observers.splice(index, 1);
    }
  }
  
  notify(message) {
    this.#observers.forEach(observer => observer.update(message));
  }
}

class ObserverInterface {
  update(data) {
    throw new Error('Method not implemented');
  }
}

module.exports = {
  Observer,
  ObserverInterface
};
