const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  nombre: { type: String },
  apellido: { type: String },
  email: { type: String },
  telefono: { type: Number },
  provincia: { type: String },
  direccion: { type: String },
  monto: { type: Number },
  cart: { type: Array },
  pagoId: { type: String },
});

let Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

module.exports = Order;
