dbConnect();
import dbConnect from "../../utils/dbConnect";

const User = require("../../Models/UserSchema");
const bcrypt = require("bcrypt");

export default async (req, res) => {
  if (req.method === "POST") {
    try {
      let { username, password, displayName } = req.body;
      if (!username || !password) {
        return res
          .status(400)
          .json({ msg: "Por favor completá todos los campos." });
      }

      const existingUser = await User.findOne({ username: username });
      if (existingUser) {
        return res.status(400).json({ msg: "Nombre de usuario en uso." });
      }

      if (!displayName) {
        displayName = username;
      }

      const salt = await bcrypt.genSalt();
      const hashedPass = await bcrypt.hash(password, salt);

      const newUser = new User({
        username: username,
        password: hashedPass,
        displayName: displayName,
      });

      const savedUser = await newUser.save();

      res.json(savedUser);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
