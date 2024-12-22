const expres = require("express");
const router = expres.Router();
const categoryController = require("../controllers/category.controller");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/auth.middleware");

// Public routes
router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategory);

// Admin routes
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  categoryController.createCategory
);
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  categoryController.updateCategory
);
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  categoryController.deleteCategory
);

module.exports = router;
