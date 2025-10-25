const mongoose = require('mongoose');
const ComplaintSchema = new mongoose.Schema({
  citizenId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['Water','Electricity','Road'], required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  priority: { type: String, enum: ['High','Medium','Low'], default: 'Medium' },
  status: { type: String, enum: ['Pending','In Progress','Resolved'], default: 'Pending' },
  assignedTo: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date }
});
module.exports = mongoose.model('Complaint', ComplaintSchema);
