// middlewares/roleMiddleware.js
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Accès refusé : rôle non autorisé' });
      }
      next();
    };
  };
  