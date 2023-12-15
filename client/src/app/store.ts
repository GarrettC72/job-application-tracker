import { configureStore } from "@reduxjs/toolkit";

import userReducer from "../features/user/userSlice";
import notificationReducer from "../features/notification/notificationSlice";
import paginationReducer from "../features/pagination/paginationSlice";
import appearanceReducer from "../features/appearance/appearanceSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    notification: notificationReducer,
    pagination: paginationReducer,
    appearance: appearanceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
