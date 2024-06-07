const jwt = require("jsonwebtoken");
require("dotenv").config();
const Blacklist = require('../models/blacklistModel.js');

const authenticateJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401); // Jika tidak ada token

  // Cek token di blacklist
  const blacklisted = await Blacklist.findOne({ token }).exec();
  if (blacklisted) {
    return res.status(401).json({ message: "Token telah diblokir" });
  }

  jwt.verify(token, process.env.JWT_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};


module.exports = authenticateJWT;
