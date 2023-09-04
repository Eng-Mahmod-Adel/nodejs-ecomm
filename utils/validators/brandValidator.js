const {check } = require("express-validator");
const validetorMiddleware = require("../../middlewares/validetorMiddlewares");

exports.getBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand id format"),
  validetorMiddleware,
];

exports.createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand name required")
    .isLength({ min: 2 })
    .withMessage("too short Brand name")
    .isLength({ max: 32 })
    .withMessage("too long Brand name"),
  validetorMiddleware,
];

exports.updateBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand id format"),
  validetorMiddleware,
];
exports.deleteBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand id format"),
  validetorMiddleware,
];
