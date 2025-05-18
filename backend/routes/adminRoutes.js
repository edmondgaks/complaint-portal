const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, isAdmin } = require('../middleware/auth');

// Middleware to check if user is admin for all routes in this router
router.use(authenticate, isAdmin);

// GET /api/admin/complaints - Admin dashboard API for complaint list
router.get('/complaints', adminController.getAllComplaints);

// POST /api/admin/response/:id - Admin can respond to complaint
router.post('/response/:id', adminController.respondToComplaint);

// GET /api/admin/dashboard - Get dashboard statistics
router.get('/dashboard', adminController.getDashboardStats);

// POST /api/admin/categories - Create a new category
router.post('/categories', adminController.createCategory);

// GET /api/admin/categories - Get all categories
router.get('/categories', adminController.getAllCategories);

module.exports = router;