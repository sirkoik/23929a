const Sequelize = require("sequelize");
const db = require("../db");

const Message = db.define("message", {
  text: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  senderId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  recipientHasRead: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
});

// clear unread messages in a conversation for a user (on the database back end)
// when they activate the conversation.
// note: only successfully updates if sending the boolean as a string
Message.clearUnreadForSender = async function (senderId, conversationId) {
  const messages = await Message.update({ recipientHasRead: 'true' }, {
    where: {
      senderId: senderId,
      conversationId: conversationId,
      recipientHasRead: false
    }
  });
  return messages;
}

module.exports = Message;
