// import package here
const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  // code here
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).send({ message: "Access Denied" });
  }
  try {
    const SECRET_KEY = "ApaAjaBolehGan";

    const verified = jwt.verify(token, SECRET_KEY);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).send({ message: "Invalid token" });
  }
};
