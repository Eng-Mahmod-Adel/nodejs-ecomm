const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: [true, "category name must be unique"],
      minlength: [2, "too short categry name"],
      maxlength: [32, "too long categry name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

const Brand = mongoose.model("Brand", brandSchema);

module.exports =  Brand;
