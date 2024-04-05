import { ColorMode } from "../types";

const USER_KEY = "loggedJobappUser";
const COLOR_MODE_KEY = "JobappColorMode";

const saveToken = (token: string) => {
  window.localStorage.setItem(USER_KEY, token);
};

const loadToken = () => {
  return window.localStorage.getItem(USER_KEY);
};

const removeToken = () => {
  window.localStorage.removeItem(USER_KEY);
};

const saveColorMode = (colorMode: ColorMode) => {
  window.localStorage.setItem(COLOR_MODE_KEY, colorMode);
};

const loadColorMode = () => {
  const colorMode = window.localStorage.getItem(COLOR_MODE_KEY);
  if (colorMode !== "light" && colorMode !== "dark") {
    return null;
  }
  return colorMode;
};

export default {
  saveToken,
  loadToken,
  removeToken,
  saveColorMode,
  loadColorMode,
};
