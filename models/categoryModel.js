const mongoose = require("mongoose");

const caregorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: [true, "category name must be unique"],
      minlength: [3, "too short categry name"],
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

const Category = mongoose.model("Category", caregorySchema);

module.exports =  Category;
