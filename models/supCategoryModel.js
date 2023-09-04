const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: [true, "Subcategory name must be unique"],
    minlength: [2, "to short Subcategory name"],
    maxlength: [32, "to long Subcategory name"],
  },
  slug: {
    type: String,
    lowercase: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "subcategory must be belong to parent category"],
  },
});

module.exports = mongoose.model("SubCategory", subCategorySchema);
