dbConnect();
import dbConnect from "../../utils/dbConnect";

const Product = require("../../Models/ProductSchema");

export default async (req, res) => {
  if (req.method === "POST") {
    try {
      let {
        name,
        description,
        categories,
        price,
        picture,
        bestSeller,
        type,
      } = req.body;

      const newProduct = new Product({
        name: name,
        description: description,
        categories: categories,
        price: price,
        picture: picture,
        bestSeller: bestSeller,
        type: type,
      });

      const savedProduct = await newProduct.save();
      res.json(savedProduct);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  if (req.method === "GET") {
    const products = await Product.find();
    res.json({ data: products });
  }
  if (req.method === "PUT") {
    const { product, id } = req.body;
    const edited = await Product.findByIdAndUpdate(id, product);
    const saved = edited.save();
    res.json({ data: edited });
  }
  if (req.method === "DELETE") {
    await Product.findByIdAndDelete(req.body.id);
    res.json({ data: "deleted" });
  }
};
