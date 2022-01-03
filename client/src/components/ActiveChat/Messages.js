import React from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";

const Messages = (props) => {
  const { messages, otherUser, userId } = props;

  console.error("[Messages]: messages", messages);

  // sort the messages array by the time the messages were created.
  // uses localeCompare to keep the sorting internationalization friendly.
  const orderedMessages = [...messages].sort((a, b) =>
    a.createdAt.localeCompare(b.createdAt)
  );

  console.error("[Messages]: orderedMessages", orderedMessages);

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
