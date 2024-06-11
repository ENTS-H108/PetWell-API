const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require("dotenv").config();
const Blacklist = require("../models/blacklistModel.js");

const authenticateJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).send({ message: "Token tidak tersedia" });
  }

  try {
    const blacklisted = await Blacklist.findOne({ token }).exec();
    if (blacklisted) {
      return res.status(401).json({ message: "Token telah diblokir" });
    }

    jwt.verify(token, process.env.JWT_KEY, (err, user) => {
      if (err) return res.sendStatus(403); // Invalid token
      req.user = user;
      next();
    });
  } catch (error) {
    console.error("Error during token authentication", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = authenticateJWT;