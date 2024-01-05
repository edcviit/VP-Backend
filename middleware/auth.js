const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET = process.env.jwtSECRET;

const authenticateJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, SECRET, (err, payload) => {
      if (err) {
        return res.sendStatus(403);
      }
      console.log(payload);
      req.email = payload.email;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

module.exports = {
  authenticateJwt,
  SECRET,
};
