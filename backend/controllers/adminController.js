const Complaint = require('../models/Complaint');
const Category = require('../models/Category');
const User = require('../models/User');
const logger = require('../utils/logger');

// Get all complaints for admin dashboard
exports.getAllComplaints = async (req, res) => {
  try {
    const { status, category, startDate, endDate, priority, page = 1, limit = 20 } = req.query;
    
    const query = {};
    
    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;
    
    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const complaints = await Complaint.find(query)
      .populate('user', 'name email phone')
      .populate('responses.respondent', 'name role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const total = await Complaint.countDocuments(query);
    
    const statusCounts = await Complaint.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    const statusSummary = statusCounts.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});
    
    res.status(200).json({
      success: true,
      count: complaints.length,
      total,
      pagination: {
        current: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit))
      },
      statusSummary,
      data: complaints
    });
  } catch (err) {
    logger.error('Error fetching admin complaints:', err);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

exports.respondToComplaint = async (req, res) => {
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
    logger.error('Error responding to complaint:', err);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    // Get complaints count by status
    const statusStats = await Complaint.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // Get complaints count by category
    const categoryStats = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    // Get complaints count by priority
    const priorityStats = await Complaint.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);
    
    const recentComplaints = await Complaint.find()
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(5);
    
    const userCount = await User.countDocuments({ role: 'citizen' });
    
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    
    const dailyTrend = await Complaint.aggregate([
      {
        $match: {
          createdAt: { $gte: last7Days }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        statusStats: statusStats.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        categoryStats: categoryStats.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        priorityStats: priorityStats.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        recentComplaints,
        userCount,
        dailyTrend
      }
    });
  } catch (err) {
    logger.error('Error fetching dashboard stats:', err);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Manage categories
exports.createCategory = async (req, res) => {
  try {
    const { name, description, agencyResponsible, contactEmail, contactPhone, subcategories } = req.body;
    
    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category already exists'
      });
    }
    
    const category = new Category({
      name,
      description,
      agencyResponsible,
      contactEmail,
      contactPhone,
      subcategories: subcategories || []
    });
    
    await category.save();
    
    res.status(201).json({
      success: true,
      data: category
    });
  } catch (err) {
    logger.error('Error creating category:', err);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (err) {
    logger.error('Error fetching categories:', err);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};