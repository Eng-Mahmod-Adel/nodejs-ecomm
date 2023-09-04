const express = require("express");
const {
  createCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeImage,
} = require("../services/categoryService");
const {
  getCategoryValidator,
  deleteCategoryValidator,
  updateCategoryValidator,
  createCategoryValidator,
} = require("../utils/validators/categoryValidator");
const subCatRoute = require("./subCategoryRoute");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use("/:categoryId/subcategories", subCatRoute);

router
  .route("/")
  .post(
    authMiddleware,
    isAdmin,
    uploadCategoryImage,
    resizeImage,
    createCategoryValidator,
    createCategory
  )
  .get(getAllCategories);

router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .delete(authMiddleware, isAdmin, deleteCategoryValidator, deleteCategory)
  .put(authMiddleware, isAdmin, updateCategoryValidator, updateCategory);

module.exports = router;
