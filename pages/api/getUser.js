dbConnect();
import dbConnect from "../../utils/dbConnect";
const User = require("../../Models/UserSchema");

export default async (req, res) => {
  if (req.method === "POST") {
    try {
      const user = await User.findById(req.body.id);
      res.json({
        data: {
          user: user._id,
        },
      });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  }
};
