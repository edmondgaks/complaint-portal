const Category = require('../models/Category');
const logger = require('../utils/logger');

// Middleware to categorize and tag complaints
exports.categorizationMiddleware = async (complaint) => {
  try {
    // Get the appropriate category info
    const category = await Category.findOne({ name: complaint.category });
    
    if (category) {
      // Assign the responsible agency
      complaint.assignedAgency = category.agencyResponsible;
      
      // Add tags based on description (simple keyword matching)
      const keywordMap = {
        'pothole': ['infrastructure', 'road', 'damage'],
        'streetlight': ['infrastructure', 'electricity', 'night'],
        'garbage': ['sanitation', 'waste', 'health'],
        'water leak': ['utility', 'water', 'infrastructure'],
        'noise': ['disturbance', 'residential', 'quality of life'],
        'park': ['recreation', 'public space', 'maintenance'],
        'safety': ['security', 'emergency', 'protection'],
        'sidewalk': ['pedestrian', 'accessibility', 'infrastructure']
      };
      
      const description = complaint.description.toLowerCase();
      const tags = new Set();
      
      // Process keyword matches
      Object.entries(keywordMap).forEach(([keyword, relatedTags]) => {
        if (description.includes(keyword.toLowerCase())) {
          relatedTags.forEach(tag => tags.add(tag));
        }
      });
      
      // Add category and subcategory as tags
      tags.add(complaint.category);
      if (complaint.subcategory) {
        tags.add(complaint.subcategory);
      }
      
      // Convert Set to array
      complaint.tags = Array.from(tags);
      
      // Set priority based on keywords (simple heuristic)
      if (
        description.includes('danger') || 
        description.includes('emergency') || 
        description.includes('hazard') ||
        description.includes('urgent')
      ) {
        complaint.priority = 'High';
      } else if (
        description.includes('broken') || 
        description.includes('leaking') || 
        description.includes('damaged')
      ) {
        complaint.priority = 'Medium';
      }
    }
    
    return complaint;
  } catch (err) {
    logger.error('Error in categorization middleware:', err);
    // Continue process even if categorization fails
    return complaint;
  }
};