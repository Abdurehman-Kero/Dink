const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getAllCategories,
  createCategory,
  deleteCategory
} = require('../controllers/categoryController');

// Get all categories
router.get('/categories', protect, authorize('admin'), getAllCategories);

// Create category
router.post('/categories', protect, authorize('admin'), createCategory);

// Delete category
router.delete('/categories/:id', protect, authorize('admin'), deleteCategory);

module.exports = router;
