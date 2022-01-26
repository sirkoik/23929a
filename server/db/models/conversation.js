const { Op } = require("sequelize");
const db = require("../db");
const Message = require("./message");

const Conversation = db.define("conversation", {});

// find conversation given a user ID and a conversation ID.
Conversation.findConversation = async function (userId, conversationId) {
  const conversation = await Conversation.findOne({
    include: [User],
    where: {
      userId: userId,
      conversationId: conversationId
    }
  });

  // return conversation or null if it doesn't exist
  return conversation;
};

module.exports = Conversation;
