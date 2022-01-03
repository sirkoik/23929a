import axios from "axios";
import socket from "../../socket";
import {
  gotConversations,
  addConversation,
  setNewMessage,
  setSearchedUsers
} from "../conversations";
import { gotUser, setFetchingStatus } from "../user";

axios.interceptors.request.use(async function (config) {
  const token = await localStorage.getItem("messenger-token");
  config.headers["x-access-token"] = token;

  return config;
});

// USER THUNK CREATORS

export const fetchUser = () => async (dispatch) => {
  dispatch(setFetchingStatus(true));
  try {
    const { data } = await axios.get("/auth/user");
    dispatch(gotUser(data));
    if (data.id) {
      socket.emit("go-online", data.id);
    }
  } catch (error) {
    console.error(error);
  } finally {
    dispatch(setFetchingStatus(false));
  }
};

export const register = (credentials) => async (dispatch) => {
  try {
    const { data } = await axios.post("/auth/register", credentials);
    await localStorage.setItem("messenger-token", data.token);
    dispatch(gotUser(data));
    socket.emit("go-online", data.id);
  } catch (error) {
    console.error(error);
    dispatch(gotUser({ error: error.response.data.error || "Server Error" }));
  }
};

export const login = (credentials) => async (dispatch) => {
  try {
    const { data } = await axios.post("/auth/login", credentials);
    await localStorage.setItem("messenger-token", data.token);
    dispatch(gotUser(data));
    socket.emit("go-online", data.id);
  } catch (error) {
    console.error(error);
    dispatch(gotUser({ error: error.response.data.error || "Server Error" }));
  }
};

export const logout = (id) => async (dispatch) => {
  try {
    await axios.delete("/auth/logout");
    await localStorage.removeItem("messenger-token");
    dispatch(gotUser({}));
    socket.emit("logout", id);
  } catch (error) {
    console.error(error);
  }
};

// CONVERSATIONS THUNK CREATORS

export const fetchConversations = () => async (dispatch) => {
  console.log("[thunkCreators] fetchConversations");
  try {
    const { data } = await axios.get("/api/conversations");
    dispatch(gotConversations(data));
  } catch (error) {
    console.error(error);
  }
};

const saveMessage = async (body) => {
  console.log(
    "[thunkCreators] saveMessage: attempting to send body to db endpoint",
    body
  );
  const { data } = await axios.post("/api/messages", body);
  console.log(
    "[thunkCreators] saveMessage: successfully posted to db endpoint",
    data
  );
  return data;
};

const sendMessage = (data, body) => {
  socket.emit("new-message", {
    message: data.message,
    recipientId: body.recipientId,
    sender: data.sender
  });
};

// message format to send: {recipientId, text, conversationId}
// conversationId will be set to null if its a brand new conversation

// NOTE: The original version of postMessage attempted use data.message without
// waiting for the promise to fulfill, and sent undefined to addConversation
export const postMessage = (body) => async (dispatch) => {
  try {
    // setup an immediate message to add to the state so it shows right away
    // before the data has been submitted to the endpoint.
    // problems:
    // 1. This doesn't know what the unique ID is since the ID is returned from the endpoint.
    // 2. This modifies the state before the data is posted and keeps it that way.
    // TODO better approach: add this to a temporary state. concatenate the temporary state,
    // then clear the temporary state once the data has been posted to the endpoint.
    const currentDate = new Date().toISOString();
    const immediateMessage = {
      conversationId: body.conversationId,
      senderId: body.senderId,
      // id: 0,
      text: body.text,
      createdAt: currentDate,
      updatedat: currentDate
    };
    console.log(
      "[thunkCreators]: postMessage: immediateMessage",
      immediateMessage
    );
    // dispatch(setNewMessage(immediateMessage));

    console.log("[thunkCreators] postMessage: body:", body);
    // console.log("[thunkCreators] postMessage: data:", data);
    // console.log("[thunkCreators] postMessage: data.message:", data.message);

    if (!body.conversationId) {
      // dispatch(addConversation(body.recipientId, data.message));
      dispatch(addConversation(body.recipientId, immediateMessage));
    } else {
      console.log(
        "[thunkCreators] postMessage: about to set new message.",
        immediateMessage
      );
      dispatch(setNewMessage(immediateMessage));
    }

    const data = await saveMessage(body);
    sendMessage(data, body);
  } catch (error) {
    console.error(error);
  }
};

export const searchUsers = (searchTerm) => async (dispatch) => {
  try {
    const { data } = await axios.get(`/api/users/${searchTerm}`);
    dispatch(setSearchedUsers(data));
  } catch (error) {
    console.error(error);
  }
};
