const express = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { userCart } = require("../services/cartService");


const router = express.Router();



router.post("/usercart",authMiddleware, userCart)



module.exports = router;
