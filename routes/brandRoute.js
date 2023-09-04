const express = require("express");
const {
  createBrand,
  getAllBrands,
  getBrand,
  deleteBrand,
  updateBrand,
  uploadBrandImage,
  resizeImage,
} = require("../services/brandService");
const {
  getBrandValidator,
  createBrandValidator,
  deleteBrandValidator,
  updateBrandValidator,
} = require("../utils/validators/brandValidator");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router
  .route("/")
  .post(
    authMiddleware,
    isAdmin,
    uploadBrandImage,
    resizeImage,
    createBrandValidator,
    createBrand
  )
  .get(getAllBrands);

router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .delete(authMiddleware, isAdmin, deleteBrandValidator, deleteBrand)
  .put(authMiddleware, isAdmin, updateBrandValidator, updateBrand);

module.exports = router;
