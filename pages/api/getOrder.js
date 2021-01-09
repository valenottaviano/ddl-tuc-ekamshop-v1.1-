dbConnect();
import dbConnect from "../../utils/dbConnect";
const Order = require("../../Models/OrderSchema");

export default async (req, res) => {
  if (req.method === "POST") {
    try {
      const order = await Order.findById(req.body.id);
      res.json({ data: order });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  }
};
