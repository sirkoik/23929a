const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");

// associations

// many-to-many association: a User can be part of many Conversations.
// Conversations can have many Users.
// This removes the two-user-per-conversation limit.
User.belongsToMany(Conversation, {through: 'userConversations', as: 'conversation'});
Conversation.belongsToMany(User, {through: 'userConversations', as: 'user'});
Message.belongsTo(Conversation);
Conversation.hasMany(Message);

module.exports = {
  User,
  Conversation,
  Message
};
