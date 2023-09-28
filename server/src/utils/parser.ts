import { Types, isObjectIdOrHexString } from "mongoose";

import { NewJob, Token, TokenType, Activity, ActivityType } from "../types";

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const isEmail = (text: string): boolean => {
  // Taken from HTML specifications
  const emailRegExp =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return text.length > 0 && emailRegExp.test(text);
};

const isTokenType = (param: string): param is TokenType => {
  return Object.values(TokenType)
    .map((v) => v.toString())
    .includes(param);
};

const isObjectIdParam = (param: unknown): param is Types.ObjectId => {
  return isObjectIdOrHexString(param);
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

const parseNonEmptyStringParam = (param: unknown, field: string): string => {
  if (!isString(param)) {
    throw new Error(`Incorrect or missing ${field}`);
  }

  if (param.trim() === "") {
    throw new Error(`${field} must be filled in`);
  }

  return param;
};

export const parseEmail = (param: unknown): string => {
  if (!isString(param) || !isEmail(param)) {
    throw new Error("Please enter a valid email address");
  }

  return param;
};

export const parseTokenType = (param: unknown): TokenType => {
  if (!isString(param) || !isTokenType(param)) {
    throw new Error("Value of token type incorrect: " + param);
  }

  return param;
};

export const parseObjectIdParam = (
  param: unknown,
  field: string
): Types.ObjectId => {
  if (!param || !isObjectIdParam(param)) {
    throw new Error(`Incorrect or missing ${field}:`);
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

export const toToken = (object: unknown): Token => {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing data");
  }

  if (!("email" in object) || !("id" in object) || !("type" in object)) {
    throw new Error("Incorrect data: some fields are missing");
  }

  const token = {
    email: parseEmail(object.email),
    id: parseObjectIdParam(object.id, "id"),
    type: parseTokenType(object.type),
  };

  return token;
};

export const toNewJob = (object: unknown): NewJob => {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing data");
  }

  if (
    !("companyName" in object) ||
    !("jobTitle" in object) ||
    !("companyWebsite" in object) ||
    !("jobPostingLink" in object) ||
    !("contactName" in object) ||
    !("contactTitle" in object) ||
    !("activities" in object) ||
    !("notes" in object)
  ) {
    throw new Error("Incorrect data: some fields are missing");
  }

  const newJob: NewJob = {
    companyName: parseNonEmptyStringParam(object.companyName, "Company Name"),
    jobTitle: parseNonEmptyStringParam(object.jobTitle, "Job Title"),
    companyWebsite: parseStringParam(object.companyWebsite, "Company Website"),
    jobPostingLink: parseStringParam(object.jobPostingLink, "Job Posting Link"),
    contactName: parseStringParam(object.contactName, "Contact Name"),
    contactTitle: parseStringParam(object.contactTitle, "Contact Title"),
    activities: parseActivities(object.activities),
    notes: parseStringParam(object.notes, "Notes"),
  };

  return newJob;
};
