const { check } = require("express-validator");
const validetorMiddleware = require("../../middlewares/validetorMiddlewares");
const Category = require("../../models/categoryModel");
const SubCategory = require("../../models/supCategoryModel");

exports.getProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product id format"),
  validetorMiddleware,
];

exports.createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("Product title is required")
    .isLength({ min: 3 })
    .withMessage("too short Product title"),
  check("description")
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ max: 2000 })
    .withMessage("too long description"),
  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product sold must be a number"),
  check("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Product price must be a number")
    .toFloat()
    .isLength({ max: 32 }),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Product priceAfterDiscount must be a number")
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("priceAfterDiscount must be lower than price");
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("colors must be Array of string"),
  check("imageCover").notEmpty().withMessage("Product imageCover is required"),
  check("image")
    .optional()
    .isArray()
    .withMessage("Product image must Arrat of string"),
  check("category")
    .notEmpty()
    .withMessage("product must be belong a category")
    .isMongoId()
    .withMessage("invalid ID formater")
    .custom((categoryId) =>
      Category.findById(categoryId).then((category) => {
        if (!category) {
          throw new Error("no category for this id");
        }
      })
    ),
  check("subcategory")
    .optional()
    .isMongoId()
    .withMessage("invalid ID formater")
    .custom((subCategoriesId) =>
      SubCategory.find({ _id: { $exists: true, $in: subCategoriesId } }).then(
        (result) => {
          if (result.length < 1 || result.length !== subCategoriesId.length) {
            return Promise.reject(new Error(`Invalid subcategories Ids`));
          }
        }
      )
    ),
  check("brand").optional().isMongoId().withMessage("invalid ID formater"),
  check("ratingAveradge")
    .optional()
    .isNumeric()
    .withMessage("ratingAveradge must be a number")
    .isLength({ min: 1 })
    .withMessage("rating must be above or equal 1.0")
    .isLength("rating must be below or equal 5.0"),
  check("ratingQuantity")
    .optional()
    .isNumeric()
    .withMessage("Product ratingQuantity must be a number"),
  validetorMiddleware,
];

exports.updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product id format"),
  validetorMiddleware,
];
exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product id format"),
  validetorMiddleware,
];
