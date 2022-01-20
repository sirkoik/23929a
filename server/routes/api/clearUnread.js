const router = require("express").Router();
const { Message } = require("../../db/models");

// expects recipientId and conversationId so that it knows which messages to mark "read"
router.patch("/", async (req, res, next) => {
  try {
    if (!req.body.recipientId || !req.body.conversationId) {
      return res.sendStatus(401);
    }

    const { recipientId, conversationId } = req.body;

    let messages = await Message.clearUnreadForSender(recipientId, conversationId);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
