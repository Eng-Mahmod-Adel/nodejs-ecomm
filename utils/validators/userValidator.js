const { check, body } = require("express-validator");
const validetorMiddleware = require("../../middlewares/validetorMiddlewares");
const User = require("../../models/userModel");
const bcrypt = require("bcrypt");

exports.getUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  validetorMiddleware,
];

exports.createUserValidator = [
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
  check("phone").optional().isMobilePhone("ar-EG").withMessage("eg only"),
  check("profileImg").optional(),
  check("role").optional(),
  validetorMiddleware,
];

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  validetorMiddleware,
];

exports.changePasswordValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  body("currentPassword")
    .notEmpty()
    .withMessage("you must enter password confirm"),
  body("password")
    .notEmpty()
    .withMessage("you must enter password")
    .custom((val, { req }) =>
      User.findById(req.params.id).then((user) => {
        if (!user) {
          throw new Error("There is no user for this id");
        }
        const isPasswordMuch = bcrypt.compareSync(
          req.body.currentPassword,
          user.password
        );

        if (!isPasswordMuch) {
          throw new Error("Incrrect current password");
        }

        if (val !== req.body.confirmPassword) {
          throw new Error("password confirmation incurrent");
        }
        return true;
      })
    ),
  validetorMiddleware,
];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  validetorMiddleware,
];
