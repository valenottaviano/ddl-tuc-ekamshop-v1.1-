dbConnect();
import dbConnect from "../../utils/dbConnect";

const Order = require("../../Models/OrderSchema");

export default async (req, res) => {
  if (req.method === "GET") {
    const orders = await Order.find();
    if (orders.length > 50) {
      await orders[1].remove();
    }
    res.json({ data: orders });
  }
  if (req.method === "POST") {
    const { totalPrice, cart, email, clientData, pagoId } = req.body;
    const newOrder = new Order({
      nombre: clientData.nombre,
      apellido: clientData.apellido,
      email: email,
      telefono: clientData.telefono,
      provincia: clientData.provincia,
      direccion: clientData.direccion,
      monto: totalPrice,
      cart,
      pagoId,
    });
    const savedOrder = await newOrder.save();
    console.log(savedOrder);
    res.status(200).json({ order: savedOrder });
  }
  //   if (req.method === "PUT") {
  //     const { product, id } = req.body;
  //     const edited = await Product.findByIdAndUpdate(id, product);
  //     const saved = edited.save();
  //     res.json({ data: edited });
  //   }
  //   if (req.method === "DELETE") {
  //     await Product.findByIdAndDelete(req.body.id);
  //     res.json({ data: "deleted" });
  //   }
};
