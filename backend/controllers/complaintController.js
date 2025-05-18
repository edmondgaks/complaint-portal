const { validationResult } = require('express-validator');
const Complaint = require('../models/Complaint');
const logger = require('../utils/logger');
const { categorizationMiddleware } = require('../middleware/categorization');

// Submit a new complaint
exports.createComplaint = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const {
      title,
      category,
      description,
      location,
      priority
    } = req.body;
    console.log(req.body);

    // Create a new complaint
    const complaint = new Complaint({
      user: req.user.id, // From auth middleware
      category,
      description,
      location,
      priority: priority || 'Medium',
      media: req.files ? req.files.map(file => file.path) : []
    });

    // Apply categorization middleware
    await categorizationMiddleware(complaint);

    // Save the complaint
    await complaint.save();

    res.status(201).json({
      success: true,
      data: complaint
    });
  } catch (err) {
    logger.error('Error creating complaint:', err);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Get complaint by ID
exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findOne({ ticketId: req.params.id })
      .populate('user', 'name email')
      .populate('responses.respondent', 'name role');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    // Check if user is authorized to view this complaint
    if (req.user.role !== 'admin' && complaint.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to view this complaint'
      });
    }

    res.status(200).json({
      success: true,
      data: complaint
    });
  } catch (err) {
    logger.error('Error fetching complaint:', err);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Get all complaints with filters
exports.getComplaints = async (req, res) => {
  try {
    const { status, category, startDate, endDate, page = 1, limit = 10 } = req.query;
    
    // Build query
    const query = {};
    
    // Apply filters
    if (status) query.status = status;
    if (category) query.category = category;
    
    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    // For non-admin users, only show their own complaints
    if (req.user.role !== 'admin') {
      query.user = req.user.id;
    }
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query
    const complaints = await Complaint.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const total = await Complaint.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: complaints.length,
      total,
      pagination: {
        current: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit))
      },
      data: complaints
    });
  } catch (err) {
    logger.error('Error fetching complaints:', err);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Update complaint status
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    // Validate status
    if (!['Submitted', 'In Progress', 'Resolved', 'Rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }
    
    const complaint = await Complaint.findOne({ ticketId: req.params.id });
    
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }
    
    // Only admins can update status
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to update complaint status'
      });
    }
    
    complaint.status = status;
    
    // Add a response to track the status change
    complaint.responses.push({
      respondent: req.user.id,
      message: `Status updated to ${status}`,
    });
    
    await complaint.save();
    
    res.status(200).json({
      success: true,
      data: complaint
    });
  } catch (err) {
    logger.error('Error updating complaint status:', err);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Add a response to a complaint
exports.addResponse = async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Response message is required'
      });
    }
    
    const complaint = await Complaint.findOne({ ticketId: req.params.id });
    
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }
    
    // Check if user is authorized to respond
    const isOwner = complaint.user.toString() === req.user.id;
    if (req.user.role !== 'admin' && !isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to respond to this complaint'
      });
    }
    
    complaint.responses.push({
      respondent: req.user.id,
      message
    });
    
    await complaint.save();
    
    res.status(200).json({
      success: true,
      data: complaint
    });
  } catch (err) {
    logger.error('Error adding response to complaint:', err);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};