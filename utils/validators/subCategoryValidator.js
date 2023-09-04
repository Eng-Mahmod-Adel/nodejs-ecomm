const { check } = require("express-validator");
const validetorMiddleware = require("../../middlewares/validetorMiddlewares");

exports.getSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory id format"),
  validetorMiddleware,
];

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("SubCategory name required")
    .isLength({ min: 2 })
    .withMessage("too short SubCategory name")
    .isLength({ max: 32 })
    .withMessage("too long SubCategory name"),
  check("categoryId")
    .notEmpty()
    .withMessage("subcategory must be belong to parent category")
    .isMongoId("Invalid CategoryId id format"),
  validetorMiddleware,
];

exports.updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory id format"),
  validetorMiddleware,
];

exports.deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory id format"),
  validetorMiddleware,
];
