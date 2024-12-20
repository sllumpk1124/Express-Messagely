const express = require("express");
const Message = require("../models/message");
const { ensureLoggedIn, ensureSenderOrRecipient, ensureRecipient } = require("../middleware/auth");
const router = new express.Router();

/** GET /:id - get detail of message. */
router.get("/:id", ensureSenderOrRecipient, async (req, res, next) => {
  try {
    const message = await Message.get(req.params.id);
    return res.json({ message });
  } catch (err) {
    return next(err);
  }
});

/** POST / - post message. */
router.post("/", ensureLoggedIn, async (req, res, next) => {
  try {
    const { to_username, body } = req.body;
    const message = await Message.create({
      from_username: req.user.username,
      to_username,
      body,
    });
    return res.json({ message });
  } catch (err) {
    return next(err);
  }
});

/** POST /:id/read - mark message as read. */
router.post("/:id/read", ensureRecipient, async (req, res, next) => {
  try {
    const message = await Message.markRead(req.params.id);
    return res.json({ message });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;