// Simple min-heap by priority value (High=1, Medium=2, Low=3)
class PriorityQueue {
  constructor(){ this.heap = []; }
  priorityVal(p){
    if(p==='High') return 1;
    if(p==='Medium') return 2;
    return 3;
  }
  push(item){
    this.heap.push(item);
    this.heap.sort((a,b)=> this.priorityVal(a.priority)-this.priorityVal(b.priority));
  }
  pop(){ return this.heap.shift(); }
  peek(){ return this.heap[0]; }
  size(){ return this.heap.length; }
}
module.exports = PriorityQueue;
