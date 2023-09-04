const Category = require("../models/categoryModel");
const ApiError = require("../utils/apiError");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const {uploadSingleImage} = require("../config/multer")
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');

// Upload single image
uploadCategoryImage = uploadSingleImage('image');

// Image processing
resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .jpeg({ quality: 95 })
      .toFile(`uploads/categories/${filename}`);

    // Save image into our db
    req.body.image = filename;
  }

  next();
});

const getAllCategories = asyncHandler(async (req, res) => {
  page = +req.query.page || 1;
  limit = +req.query.limit || 5;
  const skip = (page - 1) * limit;
  const categories = await Category.find().skip(skip).limit(limit);
  res.status(200).json({ results: categories.length, page, data: categories });
});

const getCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) return next(new ApiError("no category for this id", 404));
  res.status(200).json({ data: category });
});

const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const category = await Category.create({ name, slug: slugify(name) });
  res.status(201).json({ data: category });
});

const updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const category = await Category.findByIdAndUpdate(
    id,
    { name, slug: slugify(name) },
    {
      new: true,
    }
  );
  if (!category) return next(new ApiError("no category for this id", 404));
  res.status(200).json({ category });
});

const deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findByIdAndDelete(id);
  if (!category) return next(new ApiError("no category for this id", 404));
  res.status(204).send("category has been deleted");
});

module.exports = {
  createCategory,
  getCategory,
  deleteCategory,
  updateCategory,
  getAllCategories,
  uploadCategoryImage,
  resizeImage,
};
