const mongoose = require('mongoose');
const WorkerSchema = new mongoose.Schema({
  name: String,
  location: String,
  isAvailable: { type: Boolean, default: true }
});
module.exports = mongoose.model('Worker', WorkerSchema);
