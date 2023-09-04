const User = require("../models/userModel");
const ApiError = require("../utils/apiError");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const { jwtToken } = require("../config/jwtToken");

const signup = asyncHandler(async (req, res, next) => {
  const user = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });

  const token = jwtToken(user._id);
  res.status(201).json({ data: user, token });
});

const login = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  const passwordMutch = await bcrypt.compare(req.body.password, user.password);

  if (!user || !passwordMutch) {
    return next(new ApiError("incorrect email or password", 401));
  }
  const token = jwtToken(user._id);

  // Delete password from response
  delete user._doc.password;

  res.status(201).json({ data: user, token });
});

module.exports = {
  signup,
  login,
};
