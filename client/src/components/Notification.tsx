import { Alert } from "@mui/material";

import { useAppSelector } from "../app/hooks";

const Notification = () => {
  const notification = useAppSelector(({ notification }) => notification);

  if (!notification.message) return null;

  return <Alert severity={notification.type}>{notification.message}</Alert>;
};

export default Notification;
