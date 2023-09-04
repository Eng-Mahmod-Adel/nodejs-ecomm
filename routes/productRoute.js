const express = require("express");
const {
  createProduct,
  getAllProducts,
  getproduct,
  deleteProduct,
  updateProduct,
  uploadProductImages,
  resizeProductImages,
} = require("../services/productService");
const {
  getProductValidator,
  deleteProductValidator,
  updateProductValidator,
  createProductValidator,
} = require("../utils/validators/productValidator");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router
  .route("/")
  .post(
    authMiddleware,
    isAdmin,
    uploadProductImages,
    resizeProductImages,
    createProductValidator,
    createProduct
  )
  .get(getAllProducts);

router
  .route("/:id")
  .get(getProductValidator, getproduct)
  .delete(authMiddleware, isAdmin, deleteProductValidator, deleteProduct)
  .put(authMiddleware, isAdmin, updateProductValidator, updateProduct);

module.exports = router;
