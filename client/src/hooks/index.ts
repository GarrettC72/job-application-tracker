import { useCallback, useState } from "react";
import { AlertColor } from "@mui/material";

import { useAppDispatch } from "../app/hooks";
import { clearUser, initializeUser } from "../features/user/userSlice";
import { setNotification } from "../features/notification/notificationSlice";

export const useInitialization = () => {
  const dispatch = useAppDispatch();

  return useCallback(() => {
    dispatch(initializeUser());
  }, [dispatch]);
};

export const useClearUser = () => {
  const dispatch = useAppDispatch();

  return () => {
    dispatch(clearUser());
  };
};

export const useNotification = () => {
  const dispatch = useAppDispatch();

  return (message: string, type: AlertColor) => {
    dispatch(setNotification(message, type));
  };
};

export const useField = (type: string) => {
  const [value, setValue] = useState("");

  const onChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValue(event.target.value);
  };

  const reset = () => {
    setValue("");
  };

  return {
    type,
    value,
    onChange,
    reset,
  };
};
