import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { ColorMode } from "../../types";
import { AppDispatch } from "../../app/store";
import storageService from "../../services/storage";

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
    const colorMode = useDarkMode ? "dark" : "light";
    storageService.saveColorMode(colorMode);
    dispatch(set(colorMode));
  };
};

export const initializeColorMode = (prefersDarkMode: boolean) => {
  return async (dispatch: AppDispatch) => {
    const colorMode = storageService.loadColorMode();
    if (!colorMode) {
      dispatch(set(prefersDarkMode ? "dark" : "light"));
    } else {
      dispatch(set(colorMode));
    }
  };
};

export default appearanceSlice.reducer;
