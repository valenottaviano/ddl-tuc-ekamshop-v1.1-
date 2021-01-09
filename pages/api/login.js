dbConnect();
import dbConnect from "../../utils/dbConnect";
const User = require("../../Models/UserSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

export default async (req, res) => {
  if (req.method === "POST") {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.json({ msg: "Por favor completá todos los campos." });
      }
      const user = await User.findOne({ username: username });
      if (!user) {
        return res.json({ msg: "Datos incorrectos." });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.json({ msg: "Contraseña incorrecta." });
      }
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({
        token,
        user: {
          id: user._id,
          username: user.username,
        },
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
