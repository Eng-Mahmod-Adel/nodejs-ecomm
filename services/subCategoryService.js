const SubCategory = require("../models/supCategoryModel");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const slugify = require("slugify");

const setCatecoryIdToBody = (req, res, next) => {
  if (!req.body.categoryId) req.body.categoryId = req.params.categoryId;
  next();
};

const createSubCategory = asyncHandler(async (req, res) => {
  const { name, categoryId } = req.body;
  const subCategory = await SubCategory.create({
    name,
    slug: slugify(name),
    categoryId,
  });
  res.status(201).json({ data: subCategory });
});

const getSubCategories = asyncHandler(async (req, res) => {
  page = req.query.page || 1;
  limit = req.query.limit || 5;
  const skip = (page - 1) * limit;

  // console.log(req.params);
  filterObject = {};

  if (req.params.categoryId)
    filterObject = { categoryId: req.params.categoryId };

  const subCategory = await SubCategory.find(filterObject)
    .skip(skip)
    .limit(limit);
  res
    .status(200)
    .json({ results: subCategory.length, page, data: subCategory });
});

const getSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategory.findById(id);
  if (!subCategory)
    return next(new ApiError("no Subcategory for this id", 404));
  res.status(200).json({ data: subCategory });
});

const updateSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const subCategory = await SubCategory.findByIdAndUpdate(
    id,
    { name, slug: slugify(name) },
    {
      new: true,
    }
  );
  if (!subCategory)
    return next(new ApiError("no Subcategory for this id", 404));
  res.status(200).json({ subCategory });
});

const deleteSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategory.findByIdAndDelete(id);
  if (!subCategory)
    return next(new ApiError("no Subcategory for this id", 404));
  res.status(204).send("category has been deleted");
});

module.exports = {
  createSubCategory,
  getSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
  setCatecoryIdToBody,
};
