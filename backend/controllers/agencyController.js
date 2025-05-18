const Agency = require('../models/Agency');

// Create new agency
exports.createAgency = async (req, res) => {
  try {
    const { name, categories, contactEmail } = req.body;
    const agency = new Agency({ name, categories, contactEmail });
    await agency.save();
    res.status(201).json(agency);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAllAgencies = async (req, res) => {
  try {
    const agencies = await Agency.find();
    res.json(agencies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get agency by ID
exports.getAgencyById = async (req, res) => {
  try {
    const agency = await Agency.findById(req.params.id);
    if (!agency) return res.status(404).json({ message: 'Agency not found' });
    res.json(agency);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update agency
exports.updateAgency = async (req, res) => {
  try {
    const { name, categories, contactEmail } = req.body;
    const agency = await Agency.findByIdAndUpdate(
      req.params.id,
      { name, categories, contactEmail },
      { new: true }
    );
    if (!agency) return res.status(404).json({ message: 'Agency not found' });
    res.json(agency);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete agency
exports.deleteAgency = async (req, res) => {
  try {
    const agency = await Agency.findByIdAndDelete(req.params.id);
    if (!agency) return res.status(404).json({ message: 'Agency not found' });
    res.json({ message: 'Agency deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
