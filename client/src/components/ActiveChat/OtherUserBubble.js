import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Typography, Avatar } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    justifyContent: "space-between"
  },
  bubbleRoot: {
    display: "flex"
  },
  avatar: {
    marginRight: 11,
    marginTop: 6
  },
  avatarMain: {
    height: 30,
    width: 30
  },
  avatarSmaller: {
    height: 20,
    width: 20
  },
  usernameDate: {
    fontSize: 11,
    color: "#BECCE2",
    fontWeight: "bold",
    marginBottom: 5
  },
  bubble: {
    backgroundImage: "linear-gradient(225deg, #6CC1FF 0%, #3A8DFF 100%)",
    borderRadius: "0 10px 10px 10px"
  },
  text: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: -0.2,
    padding: 8
  }
}));

const OtherUserBubble = (props) => {
  const classes = useStyles();
  const { text, time, otherUser, isLastRead } = props;
  return (
    <Box className={classes.root}>
      <Box className={classes.bubbleRoot}>
        <Avatar alt={otherUser.username} src={otherUser.photoUrl} className={[classes.avatar, classes.avatarMain].join(" ")}></Avatar>
        <Box>
          <Typography className={classes.usernameDate}>
            {otherUser.username} {time}
          </Typography>
          <Box className={classes.bubble}>
            <Typography className={classes.text}>{text}</Typography>
          </Box>
        </Box>
      </Box>
      {isLastRead && <Avatar alt={otherUser.username} src={otherUser.photoUrl} className={[classes.avatar, classes.avatarSmaller].join(" ")}></Avatar>}
    </Box>
  );
};

export default OtherUserBubble;
