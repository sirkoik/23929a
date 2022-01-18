export const addMessageToStore = (state, payload) => {
  const { message, sender } = payload;

  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
    };
    newConvo.latestMessageText = message.text;
    newConvo.unreadCount = newConvo.unreadCount + 1 || 1;
    return [newConvo, ...state];
  }

  // find other user id. if the message is showing up in the sender's window,
  // don't increment the unread counter for the current conversation.
  const currentConvo = state.find(convo => convo.id === message.conversationId);
  const otherUserId = currentConvo?.otherUser?.id ?? -1;

  return state.map((convo) => {
    if (convo.id === message.conversationId) {
      const convoCopy = { ...convo };
      convoCopy.messages = [ ...convoCopy.messages, message ];
      convoCopy.latestMessageText = message.text;

      if (message.senderId === otherUserId) {
        convoCopy.unreadCount = convoCopy.unreadCount + 1 || 1;
      }

      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser = { ...convoCopy.otherUser, online: true };
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser = { ...convoCopy.otherUser, online: false };
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = [...state];
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      let fakeConvo = { otherUser: user, messages: [] };
      newState.push(fakeConvo);
    }
  });

  return newState;
};

export const addNewConvoToStore = (state, recipientId, message) => {
  return state.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      const convoCopy = { ...convo };
      convoCopy.id = message.conversationId;
      convoCopy.messages = [...convo.messages, message];
      convoCopy.latestMessageText = message.text;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

// sort the conversations with localeCompare so that the sort order 
// is correct for the user's locale.
//
// loads with all messages in each conversation initially unread.
// When conversations are selected or new messages are added, the 
// unread count will change.
export const sortConversations = (state, conversations) => {
  return [...conversations].map(conversation => {
    const otherUserId = conversation.otherUser.id;

    const newConvo = {...conversation};
    newConvo.unreadCount = conversation.messages.reduce((unread, current) => current.senderId === otherUserId && !current.recipientHasRead? unread + 1 : unread, 0);
    newConvo.messages.sort((a,b) => a.createdAt.localeCompare(b.createdAt));
    return newConvo;
  });
}

// clear unread messages from the active conversation.
export const clearUnreadMessages = (state, userId) => {
  //const convoId = state.find(convo => convo.otherUser.id === userId).id;

  return [...state].map(conversation => {
    const newConvo = {...conversation};
    if (conversation.otherUser.id === userId) {
      newConvo.unreadCount = 0;
    }
    return newConvo;
  });
}