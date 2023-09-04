const User = require("../models/userModel");
const Product = require("../models/productModel");
const ApiError = require("../utils/apiError");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const bcrypt = require("bcrypt");

const getAllUsers = asyncHandler(async (req, res) => {
  page = +req.query.page || 1;
  limit = +req.query.limit || 5;
  const skip = (page - 1) * limit;
  const user = await User.find().skip(skip).limit(limit);
  res.status(200).json({ results: user.length, page, data: user });
});

const getUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) return next(new ApiError("no user for this id", 404));
  res.status(200).json({ data: user });
});

const createUser = asyncHandler(async (req, res) => {
  if (req.body.username) {
    req.body.slug = slugify(req.body.username);
  }
  const user = await User.create(req.body);
  res.status(201).json({ data: user });
});

const updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (req.body.username) {
    req.body.slug = slugify(req.body.username);
  }
  const user = await User.findByIdAndUpdate(
    id,
    {
      username: req.body.username,
      email: req.body.email,
      role: req.body.role,
      phone: req.body.phone,
      slug: req.body.slug,
      profileImg: req.body.profileImg,
    },
    {
      new: true,
    }
  );
  if (!user) return next(new ApiError("no user for this id", 404));
  res.status(200).json({ user });
});

const changePassword = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findByIdAndUpdate(
    id,
    {
      password: bcrypt.hashSync(req.body.password, 10),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  if (!user) return next(new ApiError("no user for this id", 404));
  res.status(200).json({ user });
});

const deleteUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);
  if (!user) return next(new ApiError("no User for this id", 404));
  res.status(204).send("User has been deleted");
});

// const AddToCart = asyncHandler(async (req, res, next) => {
//   const { productId } = req.params;
//   const userId = req.user._id;
//   const user = await User.findById(userId);

//   if (user.cart.length == 0) {
//     user.cart.push(productId);
//   } else {
//     user.cart.map((item) => {
//       productId == item ? user.cart.pull(productId) : user.cart.push(productId);
//     });
//   }
//   user.save();
//   res.status(200).json("success");
// });

// const getUserCart = asyncHandler(async (req, res, next) => {
//   const userId = req.user._id;
//   const user = await User.findById(userId);

//   res.json(user)

// });

module.exports = {
  createUser,
  updateUser,
  getUser,
  updateUser,
  deleteUser,
  getAllUsers,
  changePassword,
};
