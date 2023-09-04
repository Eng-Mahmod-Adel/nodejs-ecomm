const express = require("express");
const {
  createUser,
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
  changePassword,
  AddToCart,
  getUserCart,
} = require("../services/userService");
const {
  createUserValidator,
  getUserValidator,
  deleteUserValidator,
  updateUserValidator,
  changePasswordValidator,
} = require("../utils/validators/userValidator");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.put("/changepassword/:id", changePasswordValidator, changePassword);

router
  .route("/")
  .post(authMiddleware, isAdmin, createUserValidator, createUser)
  .get(getAllUsers);

router
  .route("/:id")
  .get(authMiddleware, isAdmin, getUserValidator, getUser)
  .delete(authMiddleware, isAdmin, deleteUserValidator, deleteUser)
  .put(authMiddleware, isAdmin, updateUserValidator, updateUser)


module.exports = router;
