dbConnect();
import dbConnect from "../../utils/dbConnect";
const Product = require("../../Models/ProductSchema");

export default async (req, res) => {
  if (req.method === "POST") {
    try {
      const product = await Product.findById(req.body.id);
      res.json({ data: product });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  }
};
