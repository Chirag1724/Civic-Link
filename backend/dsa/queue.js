// Simple FIFO queue
class Queue {
  constructor(){ this.items = []; }
  enqueue(x){ this.items.push(x); }
  dequeue(){ return this.items.shift(); }
  size(){ return this.items.length; }
}
module.exports = Queue;
