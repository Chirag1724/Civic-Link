const Complaint = require('../models/Complaint');
const HashSet = require('../dsa/hashSet');
const PriorityQueue = require('../dsa/priorityQueue');
const { dijkstra } = require('../dsa/graph');
const Queue = require('../dsa/queue');

const dupSet = new HashSet();
const pq = new PriorityQueue();
const statusQueue = new Queue();

// POST /api/complaints
exports.createComplaint = async (req,res)=>{
  try{
    const { type, description, location, priority } = req.body;
    const citizenId = req.user.id;
    if(dupSet.has(type, location)) {
      return res.status(409).json({ error: 'Duplicate complaint detected' });
    }
    const complaint = await Complaint.create({ citizenId, type, description, location, priority });
    dupSet.add(type, location);
    pq.push(complaint);
    statusQueue.enqueue(complaint._id.toString());
    res.json({ complaint });
  }catch(err){
    res.status(500).json({ error: err.message });
  }
};

exports.getAllComplaints = async (req,res)=>{
  try{
    const list = await Complaint.find().sort({ createdAt: -1 }).limit(100);
    res.json({ list });
  }catch(err){
    res.status(500).json({ error: err.message });
  }
};

exports.getComplaint = async (req,res)=>{
  try{
    const id = req.params.id;
    const comp = await Complaint.findById(id);
    if(!comp) return res.status(404).json({ error: 'Not found' });
    res.json({ comp });
  }catch(err){
    res.status(500).json({ error: err.message });
  }
};

exports.updateStatus = async (req,res)=>{
  try{
    const id = req.params.id;
    const { status, assignedTo } = req.body;
    const comp = await Complaint.findById(id);
    if(!comp) return res.status(404).json({ error: 'Not found' });
    comp.status = status || comp.status;
    if(status==='Resolved') comp.resolvedAt = new Date();
    if(assignedTo) comp.assignedTo = assignedTo;
    await comp.save();
    res.json({ comp });
  }catch(err){
    res.status(500).json({ error: err.message });
  }
};

exports.deleteComplaint = async (req,res)=>{
  try{
    const id = req.params.id;
    await Complaint.findByIdAndDelete(id);
    res.json({ ok:true });
  }catch(err){
    res.status(500).json({ error: err.message });
  }
};

// Assigns nearest worker using mock graph; in real app integrate real coordinates
exports.assignWorker = async (req,res)=>{
  try{
    const id = req.params.id;
    const workers = req.body.workers || []; // [{name, location}]
    const complaint = await Complaint.findById(id);
    if(!complaint) return res.status(404).json({ error:'Complaint not found' });
    const nodes = workers.map(w=>w.location);
    nodes.push(complaint.location);
    const edges = {};
    nodes.forEach(a=>{
      edges[a] = {};
      nodes.forEach(b=>{
        if(a===b) return;
        const dist = Math.abs(a.length - b.length) + Math.abs((a.charCodeAt(0)||0)-(b.charCodeAt(0)||0));
        edges[a][b] = dist;
      });
    });
    let best = null;
    let bestDist = Infinity;
    for(const w of workers){
      const { distance } = dijkstra(nodes, edges, w.location, complaint.location);
      if(distance < bestDist){ bestDist = distance; best = w; }
    }
    if(!best) return res.status(400).json({ error:'No workers provided' });
    complaint.assignedTo = best.name;
    complaint.status = 'In Progress';
    await complaint.save();
    res.json({ assignedTo: best, complaint });
  }catch(err){
    res.status(500).json({ error: err.message });
  }
};
