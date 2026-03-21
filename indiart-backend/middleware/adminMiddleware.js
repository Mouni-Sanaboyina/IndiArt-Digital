const requireAdmin = (req, res, next) => {
  // verifyToken must run before this middleware
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  next();
};

module.exports = requireAdmin;