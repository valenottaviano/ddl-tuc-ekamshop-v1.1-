dbConnect();
import dbConnect from "../../utils/dbConnect";
const User = require("../../Models/UserSchema");
const jwt = require("jsonwebtoken");
const express = require("express");

export default async (req, res) => {
  if (req.method === "POST") {
    let headers = req.headers;
    try {
      const token = String(Object.values(headers)[0]);
      if (!token) return res.json(false);
      const verified = jwt.verify(token, "otta");
      if (!verified) return res.json(false);
      const user = await User.findById(verified.id);
      if (!user) return res.json(false);
      return res.json(true);
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  }
};
