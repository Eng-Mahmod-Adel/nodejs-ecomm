const Brand = require("../models/brandModel");
const ApiError = require("../utils/apiError");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const { uploadSingleImage } = require("../config/multer");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

// Upload single image
uploadBrandImage = uploadSingleImage("image");

// Image processing
resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 95 })
    .toFile(`uploads/brands/${filename}`);

  // Save image into our db
  req.body.image = filename;

  next();
});

const getAllBrands = asyncHandler(async (req, res) => {
  page = +req.query.page || 1;
  limit = +req.query.limit || 5;
  const skip = (page - 1) * limit;
  const brands = await Brand.find().skip(skip).limit(limit);
  res.status(200).json({ results: brands.length, page, data: brands });
});

const getBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await Brand.findById(id);
  if (!brand) return next(new ApiError("no brand for this id", 404));
  res.status(200).json({ data: brand });
});

const createBrand = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const brand = await Brand.create({ name, slug: slugify(name) });
  res.status(201).json({ data: brand });
});

const updateBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  if (name) {
    req.body = { name, slug: slugify(name) };
  }

  const brand = await Brand.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!brand) return next(new ApiError("no brand for this id", 404));
  res.status(200).json({ brand });
});

const deleteBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await Brand.findByIdAndDelete(id);
  if (!brand) return next(new ApiError("no brand for this id", 404));
  res.status(204).send("brand has been deleted");
});

module.exports = {
  createBrand,
  getAllBrands,
  getBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  resizeImage,
};
