import { configureStore } from "@reduxjs/toolkit";

import userReducer from "../features/user/userSlice";
import notificationReducer from "../features/notification/notificationSlice";
import paginationReducer from "../features/pagination/paginationSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    notification: notificationReducer,
    pagination: paginationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
