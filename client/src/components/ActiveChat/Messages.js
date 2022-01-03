import React from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";

const Messages = (props) => {
  const { messages, otherUser, userId, queuedMessages, conversationId } = props;

  // add queued messages for the specific user and conversation to the convo.
  const queuedMessagesForConvo = queuedMessages.filter(
    (message) => message.conversationId === conversationId
  );

  // combine all the complete and queued messages into one array.
  const messagesCompleteAndQueued = [...messages, ...queuedMessagesForConvo];

  // sort the complete and queued messages by the time the messages were created.
  // uses localeCompare to keep the sorting internationalization friendly.
  const orderedMessages = messagesCompleteAndQueued.sort((a, b) =>
    a.createdAt.localeCompare(b.createdAt)
  );

  return (
    <Box>
      {orderedMessages.map((message) => {
        const time = moment(message.createdAt).format("h:mm");

        return message.senderId === userId ? (
          <SenderBubble key={message.id} text={message.text} time={time} />
        ) : (
          <OtherUserBubble
            key={message.id}
            text={message.text}
            time={time}
            otherUser={otherUser}
          />
        );
      })}
    </Box>
  );
};

export default Messages;
