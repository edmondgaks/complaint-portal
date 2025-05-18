const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

// POST /api/users/register - Register a new user
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 8 or more characters').isLength({ min: 8 })
  ],
  userController.register
);

// POST /api/users/login - Login user
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  userController.login
);

router.get(
  '/me',
  authenticate,
  userController.getUserProfile
);

// PUT /api/users/me - Update user profile
router.put(
  '/me',
  authenticate,
  [
    check('name', 'Name cannot exceed 50 characters').optional().isLength({ max: 50 }),
    check('phone', 'Invalid phone number').optional()
  ],
  userController.updateUserProfile
);

module.exports = router;