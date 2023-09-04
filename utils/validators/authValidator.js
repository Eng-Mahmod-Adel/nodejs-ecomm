const { check } = require("express-validator");
const validetorMiddleware = require("../../middlewares/validetorMiddlewares");
const User = require("../../models/userModel");

exports.signupValidator = [
  check("username")
    .notEmpty()
    .withMessage("User name required")
    .isLength({ min: 2 })
    .withMessage("too short User name"),
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom((val) =>
      User.findOne({ email: val }).then((result) => {
        if (result) {
          return Promise.reject(new Error("Email is already exist"));
        }
      })
    ),
  check("password")
    .notEmpty()
    .withMessage("password required")
    .isLength({ min: 6 })
    .withMessage("password must be least 6 char"),
  validetorMiddleware,
];

exports.loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address"),
  check("password")
    .notEmpty()
    .withMessage("password required")
    .isLength({ min: 6 })
    .withMessage("password must be least 6 char"),
  validetorMiddleware,
];
