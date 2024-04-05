export const isEmail = (text: string): boolean => {
  // Taken from HTML specifications
  const emailRegExp =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return text.length > 0 && emailRegExp.test(text);
};

export const parseDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const offset = date.getTimezoneOffset();
  const convertedDate = new Date(date.getTime() - offset * 60 * 1000);
  return convertedDate.toISOString().split("T")[0];
};
