const jwt = require("jsonwebtoken");
const express = require("express");
var app = express();

module.exports = app.use(function (req, res, next) {
  const authorization = req.headers.authorization;
  console.log(authorization)
  const atoken = authorization.replace("Bearer ", "");
  if (!authorization) {
    return res
      .status(401)
      .json({ message: `'Access denied. No JWT provided.` });
  }
  try {
    const decode = jwt.verify(atoken, "Prity");
    console.log(decode);
    req.user = decode;
    next();
  } catch (e) {
    res.status(400).json({ message: "Invalid JWT." });
  }
});