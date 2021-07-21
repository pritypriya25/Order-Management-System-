const jwt = require("jsonwebtoken");
const express = require("express");

var app = express();

module.exports = app.use(function (req, res, next) {
  const authorization = req.headers.authorization;
  const rtoken = authorization.replace("Bearer ", "");
  if (!authorization) {
    return res
      .status(401)
      .json({ message: `'Access denied. No JWT provided.` });
  }
  try {
    const decode = jwt.verify(rtoken, "Alexis");
    console.log(decode);
    req.user = decode;
    next();
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "Invalid JWT." });
  }
});
