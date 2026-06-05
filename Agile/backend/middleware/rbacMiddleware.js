export const permit = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, no user session' });
    }
    
    if (allowedRoles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
  };
};
