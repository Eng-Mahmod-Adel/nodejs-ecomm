const jwt = require("jsonwebtoken");

const jwtToken = (payload) =>
  jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: "3d",
  });

module.exports = {jwtToken};
