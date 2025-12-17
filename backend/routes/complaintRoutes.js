const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const ctrl = require('../controllers/complaintController');

router.post('/', auth, ctrl.createComplaint);
router.get('/', auth, ctrl.getAllComplaints); // User's own complaints
router.get('/all', auth, ctrl.getAllComplaintsWithUsers); // All complaints
router.get('/:id', auth, ctrl.getComplaint);
router.put('/:id/status', auth, ctrl.updateStatus);
router.delete('/:id', auth, ctrl.deleteComplaint);
router.post('/:id/assign', auth, ctrl.assignWorker);

module.exports = router;