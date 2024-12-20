const express = require("express");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const User = require("../models/user");
const router = new express.Router();

/** POST /login - login: {username, password} => {token} */
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const isValid = await User.authenticate(username, password);
    if (isValid) {
      const token = jwt.sign({ username }, SECRET_KEY);
      await User.updateLoginTimestamp(username);
      return res.json({ token });
    }
    throw new ExpressError("Invalid username/password", 400);
  } catch (err) {
    return next(err);
  }
});

/** POST /register - register user: registers, logs in, and returns token. */
router.post("/register", async (req, res, next) => {
  try {
    const { username, password, first_name, last_name, phone } = req.body;
    const newUser = await User.register({ username, password, first_name, last_name, phone });
    const token = jwt.sign({ username: newUser.username }, SECRET_KEY);
    await User.updateLoginTimestamp(username);
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;