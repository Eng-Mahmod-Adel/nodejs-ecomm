const Product = require("../models/productModel");
const ApiError = require("../utils/apiError");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const {uploadMixOfImages} = require('../config/multer')
const sharp = require("sharp");
const { v4: uuidv4 } = require('uuid');

uploadProductImages = uploadMixOfImages([
  {
    name: 'imageCover',
    maxCount: 1,
  },
  {
    name: 'images',
    maxCount: 5,
  },
]);

resizeProductImages = asyncHandler(async (req, res, next) => {
  // console.log(req.files);
  //1- Image processing for imageCover
  if (req.files.imageCover) {
    const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${imageCoverFileName}`);

    // Save image into our db
    req.body.imageCover = imageCoverFileName;
  }
  //2- Image processing for images
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat('jpeg')
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${imageName}`);

        // Save image into our db
        req.body.images.push(imageName);
      })
    );

    next();
  }
});

const createProduct = asyncHandler(async (req, res) => {
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }
  const product = await Product.create(req.body);
  res.json(product);
});

const getAllProducts = asyncHandler(async (req, res) => {
  //filtering
  const queryStringObject = { ...req.query };
  const excludesFields = ["page", "sort", "limit", "field"];
  excludesFields.forEach((field) => {
    delete queryStringObject[field];
  });
  let queryStr = JSON.stringify(queryStringObject);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  //pagination
  page = +req.query.page || 1;
  limit = +req.query.limit || 5;
  const skip = (page - 1) * limit;

  let mongooseQuery = Product.find(JSON.parse(queryStr))
    .skip(skip)
    .limit(limit)
    .populate({ path: "category", select: "name -_id" });

  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    mongooseQuery = mongooseQuery.sort(sortBy);
  } else {
    mongooseQuery = mongooseQuery.sort("-createdAt");
  }

  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    console.log(fields);
    mongooseQuery = mongooseQuery.select(fields);
  } else {
    mongooseQuery = mongooseQuery.select("-__v");
  }

  if (req.query.keyword) {
    const query = {};
    query.$or = [
      { title: { $regex: req.query.keyword, $options: "i" } },
      { description: { $regex: req.query.keyword, $options: "i" } },
    ];

    mongooseQuery = mongooseQuery.find(query);
  }

  const products = await mongooseQuery;

  res.status(200).json({ results: products.length, page, data: products });
});

const getproduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) return next(new ApiError("no product for this id", 404));
  res.status(200).json({ data: product });
});

const updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }

  if (req.body.priceAfterDiscount) {
    const findProduct = await Product.findById(id);
    if (findProduct.price <= req.body.priceAfterDiscount)
      return next(
        new ApiError("priceAfterDiscount must be lower than price", 400)
      );
  }

  const product = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!product) return next(new ApiError("no product for this id", 404));
  res.status(200).json({ product });
});

const deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);
  if (!product) return next(new ApiError("no product for this id", 404));
  res.status(204).send("product has been deleted");
});

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getproduct,
  uploadProductImages,
  resizeProductImages,
};
