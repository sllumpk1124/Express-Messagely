const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const ExpressError = require("../expressError");
const Message = require("../models/message");

/** Middleware to ensure user is logged in */
function ensureLoggedIn(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const payload = jwt.verify(token, SECRET_KEY);
    req.user = payload;
    return next();
  } catch (err) {
    return next(new ExpressError("Unauthorized", 401));
  }
}

/** Middleware to ensure correct user */
function ensureCorrectUser(req, res, next) {
  try {
    if (req.user.username === req.params.username) {
      return next();
    }
    throw new ExpressError("Unauthorized", 401);
  } catch (err) {
    return next(err);
  }
}

/** Middleware to ensure sender or recipient of message */
async function ensureSenderOrRecipient(req, res, next) {
  try {
    const message = await Message.get(req.params.id);
    if (req.user.username === message.from_user.username || req.user.username === message.to_user.username) {
      return next();
    }
    throw new ExpressError("Unauthorized", 401);
  } catch (err) {
    return next(err);
  }
}

/** Middleware to ensure recipient of message */
async function ensureRecipient(req, res, next) {
  try {
    const message = await Message.get(req.params.id);
    if (req.user.username === message.to_user.username) {
      return next();
    }
    throw new ExpressError("Unauthorized", 401);
  } catch (err) {
    return next(err);
  }
}

function authenticateJWT(req, res, next) {
  try {
    const tokenFromBody = req.body._token || req.headers.authorization?.split(" ")[1];
    if (tokenFromBody) {
      const payload = jwt.verify(tokenFromBody, SECRET_KEY);
      req.user = payload;
    }
    return next();
  } catch (err) {
    return next(); // Proceed without a user
  }
}

module.exports = { ensureLoggedIn, ensureCorrectUser, ensureSenderOrRecipient, ensureRecipient, authenticateJWT };