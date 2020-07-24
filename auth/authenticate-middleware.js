/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/

const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  //
  const token = req.headers.token;
  const secret = process.env.JWT_SECRET || "is it secret, is it safe?";

  if (token) {
    jwt.verify(token, secret, (err, decodedToken) => {
      if (err) {
        res.status(401).json({ you: "can't touch this!" });
      } else {
        req.jwt = decodedToken;
        next();
      }
    });
  } else {
    console.log("test");
    res.status(401).json({ you: "shall not pass!" });
  }
};
