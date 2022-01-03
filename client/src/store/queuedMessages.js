// queuedMessages: This state slice manages message queuing.
// Messages are queued before they are sent to the server,
// then removed from the queue.
// This allows the posted message to be shown in the UI immediately.

// ACTIONS

import {
  addQueuedMessageToStore,
  removeQueuedMessageFromStore
} from "./utils/reducerFunctions";

const SET_QUEUED_MESSAGE = "SET_QUEUED_MESSAGE";
const REMOVE_QUEUED_MESSAGE = "REMOVE_QUEUED_MESSAGE";

// ACTION CREATORS

export const setQueuedMessage = (message) => {
  return { type: SET_QUEUED_MESSAGE, payload: message };
};

export const removeQueuedMessage = (id) => {
  return { type: REMOVE_QUEUED_MESSAGE, payload: id };
};

// REDUCER

const reducer = (state = [], action) => {
  switch (action.type) {
    case SET_QUEUED_MESSAGE:
      return addQueuedMessageToStore(state, action.payload);
    case REMOVE_QUEUED_MESSAGE:
      return removeQueuedMessageFromStore(state, action.payload);
    default:
      return state;
  }
};

export default reducer;
