const jwt = require("jsonwebtoken");

function verifyJWT(req, res, next) {
  // get the token
  const token = req.headers["x-access-token"];

  if (!token) {
    res.json({ message: "Please provide a token." });
  }
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedValue) => {
      if (err) {
        res.json({ message: "Invalid token." });
      } else {
        next();
      }
    });
  }
}

module.exports = {
  verifyJWT: verifyJWT,
};
