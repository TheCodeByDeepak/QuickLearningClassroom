const jwt = require('jsonwebtoken');

// Middleware to verify the token
const verifyToken = (req, res, next) => {
  // Extract token from the Authorization header
  const token = req.headers['authorization']?.split(' ')[1];

  // Check if token is present
  if (!token) {
    return res.status(403).json({ message: 'A token is required for authentication' });
  }

  try {
    // Verify the token using your JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Store user data in req.user
    req.user = { id: decoded.id, role: decoded.role };
  } catch (err) {
    return res.status(401).json({ message: 'Invalid Token' });
  }
  
  // Proceed to the next middleware or route handler
  next();
};

// Middleware to verify user roles
const verifyRole = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if the user's role is in the allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Proceed if the role is allowed
    next();
  };
};



module.exports = { verifyToken, verifyRole };
