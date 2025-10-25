const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');

router.get('/summary', async (req,res)=>{
  try{
    const total = await Complaint.countDocuments();
    const pending = await Complaint.countDocuments({status:'Pending'});
    const resolved = await Complaint.countDocuments({status:'Resolved'});
    const avg = await Complaint.aggregate([
      { $match: { resolvedAt: { $ne: null } } },
      { $project: { diff: { $subtract: ['$resolvedAt','$createdAt'] } } },
      { $group: { _id: null, avg: { $avg: '$diff' } } }
    ]);
    res.json({ total, pending, resolved, avgResolutionMs: avg[0]?avg[0].avg:null });
  }catch(err){ res.status(500).json({ error: err.message }); }
});

router.get('/frequent-types', async (req,res)=>{
  try{
    const agg = await Complaint.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json({ types: agg });
  }catch(err){ res.status(500).json({ error: err.message }); }
});

module.exports = router;
