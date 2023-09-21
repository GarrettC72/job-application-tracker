import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { LoginData } from "../../types";
import { AppDispatch } from "../../app/store";
import storageService from "../../services/storage";

type UserState = LoginData | null;

const initialState: UserState = null as UserState;

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    set(_state, action: PayloadAction<LoginData>) {
      return action.payload;
    },
    clear() {
      return initialState;
    },
  },
});

export const { set, clear } = userSlice.actions;

export const loginUser = (user: LoginData) => {
  return async (dispatch: AppDispatch) => {
    storageService.saveUser(user);
    dispatch(set(user));
  };
};

export const initializeUser = () => {
  return async (dispatch: AppDispatch) => {
    const user = storageService.loadUser();
    dispatch(set(user));
  };
};

export const clearUser = () => {
  return async (dispatch: AppDispatch) => {
    storageService.removeUser();
    dispatch(clear());
  };
};

export default userSlice.reducer;
