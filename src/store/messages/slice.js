/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-self-assign */
/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialMessageListState } from "./initialState";

const messageSlice = createSlice({
  name: "messageState",
  initialState: initialMessageListState,
  reducers: {
    setMessageList(state, action) {
      return {
        // ...state, messageData: [...state.messageData, action.payload],
        ...state,
        messageData: {
          ...state.messageData,
          [action.payload.from]: [...state?.messageData[action.payload.from] || [], action.payload],
        },
      };
    },
    setSendMessageAcknowledgement(state, action) {
      return {
        ...state,
        ackowledgement: [...state.ackowledgement, action.payload]
      }
    },
    setSendMessage(state, action) {
      return {
        // ...state, messageData: [...state.messageData, action.payload],
        ...state,
        messageData: {
          ...state.messageData,
          [action.payload.to]: [...state?.messageData[action.payload.to] || [], action.payload],
        },
      };
    },
    setUsersList(state, action) {
      return {
        ...state, users: action.payload,
      };
    },
  },
  extraReducers: {

  },
});
export const { setMessageList, setUsersList, setSendMessage, setSendMessageAcknowledgement } = messageSlice.actions;
const messageReducer = messageSlice.reducer;
export default messageReducer;
