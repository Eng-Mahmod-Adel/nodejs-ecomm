const express = require("express");
const {
  createSubCategory,
  getSubCategories,
  updateSubCategory,
  deleteSubCategory,
  getSubCategory,
  setCatecoryIdToBody,
} = require("../services/subCategoryService");
const {
  createSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
  getSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(authMiddleware, isAdmin,setCatecoryIdToBody, createSubCategoryValidator, createSubCategory)
  .get(getSubCategories);
router
  .route("/:id")
  .put(authMiddleware, isAdmin,updateSubCategoryValidator, updateSubCategory)
  .delete(authMiddleware, isAdmin,deleteSubCategoryValidator, deleteSubCategory)
  .get(getSubCategoryValidator, getSubCategory);

module.exports = router;
