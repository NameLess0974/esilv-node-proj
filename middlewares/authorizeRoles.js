const { authorizeRoles } = require('../middlewares/roleMiddleware');

// Route réservée aux superadmin et admin
router.post(
  '/admin-only-route',
  authenticateToken,
  authorizeRoles('admin', 'superadmin'),
  adminController.someFunction
);

// Route réservée aux librarian, admin, superadmin
router.post(
  '/books',
  authenticateToken,
  authorizeRoles('librarian', 'admin', 'superadmin'),
  bookController.createBook
);
