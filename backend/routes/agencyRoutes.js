const express = require('express');
const router = express.Router();
const agencyController = require('../controllers/agencyController');

// CRUD routes for agencies
router.post('/', agencyController.createAgency);
router.get('/', agencyController.getAllAgencies);
router.get('/:id', agencyController.getAgencyById);
router.put('/:id', agencyController.updateAgency);
router.delete('/:id', agencyController.deleteAgency);

module.exports = router;
