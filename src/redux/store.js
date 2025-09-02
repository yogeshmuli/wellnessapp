import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth";
import userReducer from "./slices/user";
import notificationReducer from "./slices/notification";
import challengesReducer from "./slices/challenge";
import friendsReducer from "./slices/friends";
import contentReducer from "./slices/content";

let Store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    friends: friendsReducer,
    notification: notificationReducer,
    challenge: challengesReducer,
    content: contentReducer,
  },
});

export default Store;
