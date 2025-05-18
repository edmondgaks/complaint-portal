const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const { authenticate } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const { categorizationMiddleware } = require('../middleware/categorization');

// POST /api/complaints - Submit a new complaint
router.post(
  '/', 
  authenticate,
  upload.array('media', 5), // Allow up to 5 files
  [
    check('category', 'Category is required').not().isEmpty(),
    check('description', 'Description is required and must be at least 10 characters').isLength({ min: 10 }),
    check('location', 'Location is required').not().isEmpty()
  ],
  complaintController.createComplaint
);
router.get('/my', authenticate, complaintController.getUserComplaints);

router.get(
  '/:id',
  authenticate,
  complaintController.getComplaintById
);



// GET /api/complaints - List complaints (with filters)
router.get(
  '/',
  authenticate,
  complaintController.getComplaints
);

router.patch(
  '/:id/status',
  authenticate,
  [
    check('status', 'Status is required').not().isEmpty()
  ],
  complaintController.updateComplaintStatus
);

router.post(
  '/:id/response',
  authenticate,
  [
    check('message', 'Message is required').not().isEmpty()
  ],
  complaintController.addResponse
);

module.exports = router;