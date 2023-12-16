import { ColorMode, LoginData } from "../types";
import { toLoginData } from "../utils/parser";

const USER_KEY = "loggedJobappUser";
const COLOR_MODE_KEY = "JobappColorMode";

const saveUser = (user: LoginData) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

const loadUser = () => {
  const user = JSON.parse(window.localStorage.getItem(USER_KEY) ?? "null");

  if (user === null) {
    return null;
  }

  try {
    const parsedUser = toLoginData(user);
    return parsedUser;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    }
    removeUser();
    return null;
  }
};

const removeUser = () => {
  localStorage.removeItem(USER_KEY);
};

const saveColorMode = (colorMode: ColorMode) => {
  localStorage.setItem(COLOR_MODE_KEY, colorMode);
};

const loadColorMode = () => {
  const colorMode = window.localStorage.getItem(COLOR_MODE_KEY);
  if (colorMode !== "light" && colorMode !== "dark") {
    return null;
  }
  return colorMode;
};

export default {
  saveUser,
  loadUser,
  removeUser,
  saveColorMode,
  loadColorMode,
};
