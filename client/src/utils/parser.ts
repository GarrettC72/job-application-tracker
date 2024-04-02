import { LoginData } from "../types";

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

export const isEmail = (text: string): boolean => {
  // Taken from HTML specifications
  const emailRegExp =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return text.length > 0 && emailRegExp.test(text);
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseStringParam = (param: unknown, field: string): string => {
  if (!isString(param)) {
    throw new Error(`Incorrect or missing ${field}`);
  }

  return param;
};

export const parseEmail = (param: unknown): string => {
  if (!isString(param) || !isEmail(param)) {
    throw new Error("Please enter a valid email address");
  }

  return param;
};

export const parseDateParam = (date: unknown, field: string): string => {
  if (!isString(date) || !isDate(date)) {
    throw new Error(`Value of ${field} incorrect: ${date}`);
  }

  return date;
};

export const toLoginData = (object: unknown): LoginData => {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing data");
  }

  if (!("token" in object) || !("email" in object) || !("name" in object)) {
    throw new Error("Incorrect data: some fields are missing in activities");
  }

  const loginData: LoginData = {
    token: parseStringParam(object.token, "token"),
    email: parseEmail(object.email),
    name: parseStringParam(object.name, "name"),
  };

  return loginData;
};

export const convertDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const offset = date.getTimezoneOffset();
  const convertedDate = new Date(date.getTime() - offset * 60 * 1000);
  return convertedDate.toISOString().split("T")[0];
};
