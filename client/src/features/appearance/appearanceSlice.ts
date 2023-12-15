import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { ColorMode } from "../../types";
import { AppDispatch } from "../../app/store";

interface AppearanceState {
  colorMode: ColorMode;
}

const initialState: AppearanceState = {
  colorMode: "light",
};

export const appearanceSlice = createSlice({
  name: "appearance",
  initialState,
  reducers: {
    set(state, action: PayloadAction<ColorMode>) {
      state.colorMode = action.payload;
    },
  },
});

export const { set } = appearanceSlice.actions;

export const setColorMode = (useDarkMode: boolean) => {
  return async (dispatch: AppDispatch) => {
    dispatch(set(useDarkMode ? "dark" : "light"));
  };
};

export default appearanceSlice.reducer;
