const { check } = require('express-validator');

// Validation schemas for reuse
exports.complaintValidation = [
  check('category', 'Category is required').not().isEmpty(),
  check('description', 'Description is required and must be at least 10 characters').isLength({ min: 10 }),
  check('location.address', 'Address is required').not().isEmpty()
];

exports.userValidation = {
  register: [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 8 or more characters').isLength({ min: 8 })
  ],
  login: [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  update: [
    check('name', 'Name cannot exceed 50 characters').optional().isLength({ max: 50 }),
    check('phone', 'Invalid phone number').optional()
  ]
};

exports.categoryValidation = [
  check('name', 'Category name is required').not().isEmpty(),
  check('agencyResponsible', 'Responsible agency is required').not().isEmpty()
];

// Helper functions for custom validation
exports.sanitizeFilters = (req, res, next) => {
  // Sanitize and validate query parameters
  const allowedFilters = ['status', 'category', 'startDate', 'endDate', 'page', 'limit', 'priority'];
  const queryParams = req.query;
  
  Object.keys(queryParams).forEach(key => {
    if (!allowedFilters.includes(key)) {
      delete queryParams[key];
    }
  });
  
  next();
};