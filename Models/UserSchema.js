const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 5 },
  displayName: { type: String },
});

let User = mongoose.models.User || mongoose.model("User", UserSchema);

module.exports = User;
