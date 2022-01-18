import React from "react";
import { Box, Typography } from "@material-ui/core";
import { BadgeAvatar, ChatContent } from "../Sidebar";
import { makeStyles } from "@material-ui/core/styles";
import { setActiveChat } from "../../store/activeConversation";
import { connect } from "react-redux";
import { clearActiveUnreadMessages } from "../../store/utils/thunkCreators";

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 8,
    height: 80,
    boxShadow: "0 2px 10px 0 rgba(88,133,196,0.05)",
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    "&:hover": {
      cursor: "grab"
    }
  },
  bubble: {
    backgroundColor: "#3A8DFF",
    borderRadius: "25px",
    height: "27px",
    paddingLeft: "10px",
    paddingRight: "10px",
    color: "#FFFFFF",
    fontWeight: "bold",
    lineHeight: "27px"
  },
  text: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: -0.2,
    padding: 8,
  }
}));

const Chat = (props) => {
  const classes = useStyles();
  const { conversation } = props;
  const { otherUser } = conversation;

  const handleClick = async (conversation) => {
    await props.setActiveChat(conversation.otherUser.username);
    await props.clearActiveUnread(conversation.otherUser.id);
  };

  return (
    <Box onClick={() => handleClick(conversation)} className={classes.root}>
      <BadgeAvatar
        photoUrl={otherUser.photoUrl}
        username={otherUser.username}
        online={otherUser.online}
        sidebar={true}
      />
      <ChatContent conversation={conversation} />
      {!!conversation.unreadCount && (
        <Box className={classes.bubble}>
            {conversation.unreadCount}
        </Box>
      )}      
    </Box>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveChat: (id) => {
      dispatch(setActiveChat(id));
    },
    clearActiveUnread: (userId) => {
      dispatch(clearActiveUnreadMessages(userId));
    }
  };
};

export default connect(null, mapDispatchToProps)(Chat);
