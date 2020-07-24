const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = require('express').Router();
const db = require('../database/dbConfig.js');

router.post("/register", (req, res) => {
  const credentials = req.body;

  if (credentials.username && credentials.password && typeof credentials.password === "string") {
    const rounds = process.env.BCRYPT_ROUNDS || 8;

    const hash = bcryptjs.hashSync(credentials.password, rounds);

    credentials.password = hash;

    db('users').insert(credentials)
      .then(id => {
        const token = makeJwt(id);
        res.status(201).json({ data: credentials, token });
      })
      .catch(error => {
        res.status(500).json({ message: error.message });
      });
  } else {
    res.status(400).json({
      message: "please provide username and password and the password shoud be alphanumeric",
    });
  }
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username && password && typeof password === "string") {
    db('users').where({ username: username })
      .then(([user]) => {
        console.log("user", user);
        if (user && bcryptjs.compareSync(password, user.password)) {
          const token = makeJwt(user);

          res.status(200).json({ message: "Welcome to our API", token });
        } else {
          res.status(401).json({ message: "Invalid credentials" });
        }
      })
      .catch(error => {
        res.status(500).json({ message: error.message });
      });
  } else {
    res.status(400).json({
      message: "please provide username and password and the password shoud be alphanumeric",
    });
  }
});

function makeJwt(user) {
  const payload = {
    username: user.username
  };

  const secret = process.env.JWT_SECRET || "is it secret, is it safe?";

  const options = {
    expiresIn: "1h",
  };

  return jwt.sign(payload, secret, options);
}

module.exports = router;
