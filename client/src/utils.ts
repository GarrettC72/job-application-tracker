import { Activity, ActivityType, LoginData } from "./types";

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const isEmail = (text: string): boolean => {
  // Taken from HTML specifications
  const emailRegExp =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return text.length > 0 && emailRegExp.test(text);
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const isActivityType = (param: string): param is ActivityType => {
  return Object.values(ActivityType)
    .map((v) => v.toString())
    .includes(param);
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

export const parseActivityType = (param: unknown): ActivityType => {
  if (!isString(param) || !isActivityType(param)) {
    throw new Error("Incorrect or missing Activity Type");
  }

  return param;
};

export const parseActivities = (object: unknown): Activity[] => {
  if (!Array.isArray(object)) {
    // we will just trust the data to be in correct form
    return [] as Activity[];
  }

  const activities: Activity[] = object.map((activity: unknown): Activity => {
    if (!activity || typeof activity !== "object") {
      throw new Error("Incorrect or missing data in activities");
    }

    if (
      !("activityType" in activity) ||
      !("date" in activity) ||
      !("description" in activity)
    ) {
      throw new Error("Incorrect data: some fields are missing in activities");
    }

    const parsedActivity: Activity = {
      activityType: parseActivityType(activity.activityType),
      date: parseDateParam(activity.date, "Activity Date"),
      description: parseStringParam(
        activity.description,
        "Activity Description"
      ),
    };

    return parsedActivity;
  });

  return activities;
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
