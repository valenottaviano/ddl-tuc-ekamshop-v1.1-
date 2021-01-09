const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  list: { type: Array },
});

let Category =
  mongoose.models.Category || mongoose.model("Category", CategorySchema);

module.exports = Category;
