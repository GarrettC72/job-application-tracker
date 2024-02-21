import { AlertColor } from "@mui/material";

import { useAppDispatch } from "../app/hooks";
import { setNotification } from "../features/notification/notificationSlice";

const useNotification = () => {
  const dispatch = useAppDispatch();

  return (message: string, type: AlertColor) => {
    dispatch(setNotification(message, type));
  };
};

export default useNotification;
