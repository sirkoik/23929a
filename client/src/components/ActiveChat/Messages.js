import React from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";

const Messages = (props) => {
  const { messages, otherUser, userId } = props;

  // looks for the last read id in a conversation.
  // the conversation must be sorted ascending by locale date.
//  const lastReadId = messages.reduce((acc, message) => ((message.recipientHasRead && message.senderId === userId) || message.senderId === otherUser.id)? message.id : acc, -1);
  const lastReadId = otherUser.lastReadId;

  return (
    <Box>
      {messages.map((message) => {
        const time = moment(message.createdAt).format("h:mm");

        const isLastRead = message.id === lastReadId;

        return message.senderId === userId ? (
          <SenderBubble key={message.id} text={message.text} time={time} otherUser={otherUser} isLastRead={isLastRead} />
        ) : (
          <OtherUserBubble key={message.id} text={message.text} time={time} otherUser={otherUser} isLastRead={isLastRead} />
        );
      })}
    </Box>
  );
};

export default Messages;
