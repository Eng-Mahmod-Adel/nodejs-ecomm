const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const ApiError = require("../utils/apiError");
const asyncHandler = require("express-async-handler");

const userCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;
  const findProduct = await Product.findById(productId);

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [
        {
          product: findProduct._id,
          price: findProduct.price,
          color: color,
          quantity: 1,
        },
      ],
    });
  } else {
    const productIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color
    );

    if (productIndex > -1) {
      const cartItem = cart.cartItems[productIndex];
      cartItem.quantity += 1;
      cart.cartItems[productIndex] = cartItem;
    } else {
      cart.cartItems.push({
        product: productId,
        color,
        price: findProduct.price,
        quantity: 1,
      });
    }
  }

  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.price * item.quantity;
  });
  cart.totalCartPrice = totalPrice;
  
  await cart.save();
  res.json(cart);
});

module.exports = {
  userCart,
};
