import { LoginData } from '../types';

const KEY = 'loggedJobappUser';

const saveUser = (user: LoginData) => {
  localStorage.setItem(KEY, JSON.stringify(user));
};

const loadUser = () => {
  return JSON.parse(window.localStorage.getItem(KEY) ?? 'null');
};

const removeUser = () => {
  localStorage.removeItem(KEY);
};

export default {
  saveUser,
  loadUser,
  removeUser,
};
