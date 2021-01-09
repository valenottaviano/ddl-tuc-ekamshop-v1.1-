const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  categories: { type: Array },
  picture: { type: String },
  price: { type: Number },
  bestSeller: { type: Boolean },
  type: { type: Array },
});

let Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

module.exports = Product;
