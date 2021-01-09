dbConnect();
import dbConnect from "../../utils/dbConnect";
const Category = require("../../Models/CategorySchema");

export default async (req, res) => {
  if (req.method === "GET") {
    try {
      const category = await Category.find();
      res.json({ data: category });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  }
  if (req.method === "POST") {
    try {
      const newCategory = new Category({
        list: [],
      });
      const savedCategory = await newCategory.save();
      res.json(savedCategory);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: err.message });
    }
  }
  if (req.method === "PUT") {
    const { list, id } = req.body;
    const edited = await Category.findByIdAndUpdate(id, { list: list });
    const saved = edited.save();
    res.json({ data: edited });
  }
};
