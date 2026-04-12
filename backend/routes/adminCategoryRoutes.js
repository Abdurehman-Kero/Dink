const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { sequelize } = require('../config/database');

// Get all categories
router.get('/categories', protect, authorize('admin'), async (req, res) => {
  try {
    const [categories] = await sequelize.query(`
      SELECT c.*, COUNT(e.id) as event_count
      FROM event_categories c
      LEFT JOIN events e ON c.id = e.category_id
      GROUP BY c.id
      ORDER BY c.name ASC
    `);
    res.json({ success: true, categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create category
router.post('/categories', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, slug, icon_url } = req.body;
    
    if (!name || !slug) {
      return res.status(400).json({ message: 'Name and slug are required' });
    }
    
    // Check if slug exists
    const [existing] = await sequelize.query(
      'SELECT id FROM event_categories WHERE slug = ?',
      { replacements: [slug] }
    );
    
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Category with this slug already exists' });
    }
    
    await sequelize.query(`
      INSERT INTO event_categories (id, name, slug, icon_url, is_active, created_at)
      VALUES (REPLACE(UUID(), '-', ''), ?, ?, ?, true, NOW())
    `, { replacements: [name, slug, icon_url || null] });
    
    res.status(201).json({ success: true, message: 'Category created successfully' });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete category
router.delete('/categories/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    
    const [categories] = await sequelize.query(
      'SELECT * FROM event_categories WHERE id = ?',
      { replacements: [id] }
    );
    
    if (categories.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Check if category has events
    const [events] = await sequelize.query(
      'SELECT COUNT(*) as count FROM events WHERE category_id = ?',
      { replacements: [id] }
    );
    
    if (events[0].count > 0) {
      return res.status(400).json({ 
        message: `Cannot delete category with ${events[0].count} events. Reassign events first.` 
      });
    }
    
    await sequelize.query('DELETE FROM event_categories WHERE id = ?', { replacements: [id] });
    
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
