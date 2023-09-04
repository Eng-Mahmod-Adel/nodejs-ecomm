const { check } = require("express-validator");
const validetorMiddleware = require("../../middlewares/validetorMiddlewares");

exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id format"),
  validetorMiddleware,
];

exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category name required")
    .isLength({ min: 3 })
    .withMessage("too short category name")
    .isLength({ max: 32 })
    .withMessage("too long category name"),
  validetorMiddleware,
];

exports.updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id format"),
  validetorMiddleware,
];
exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id format"),
  validetorMiddleware,
];
