const jwt = require('jsonwebtoken');
const { sequelize } = require('../config/database');

const protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dems-secret-key');
      
      const [users] = await sequelize.query(
        'SELECT id, role_id, full_name, email FROM users WHERE id = ?',
        { replacements: [decoded.id] }
      );
      
      if (users.length === 0) {
        return res.status(401).json({ message: 'User not found' });
      }
      
      req.user = users[0];
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
  
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    // For now, allow all authenticated users
    // In production, check roles properly
    next();
  };
};

module.exports = { protect, authorize };
