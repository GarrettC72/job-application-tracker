import { LoginData } from "../types";
import { toLoginData } from "../utils/parser";

const KEY = "loggedJobappUser";

const saveUser = (user: LoginData) => {
  localStorage.setItem(KEY, JSON.stringify(user));
};

const loadUser = () => {
  const user = JSON.parse(window.localStorage.getItem(KEY) ?? "null");

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
  localStorage.removeItem(KEY);
};

export default {
  saveUser,
  loadUser,
  removeUser,
};
