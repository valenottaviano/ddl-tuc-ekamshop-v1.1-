dbConnect();
import dbConnect from "../../utils/dbConnect";

const Order = require("../../Models/OrderSchema");

export default async (req, res) => {
  if (req.method === "POST") {
    const { clientData } = req.body;
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
};
