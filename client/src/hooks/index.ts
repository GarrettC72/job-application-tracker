import { useCallback, useState } from "react";
import { AlertColor } from "@mui/material";
import { useQuery } from "@apollo/client";

import { useAppDispatch, useAppSelector } from "../app/hooks";
import { clearUser, initializeUser } from "../features/user/userSlice";
import { setNotification } from "../features/notification/notificationSlice";
import { USER_JOBS } from "../graphql/queries";

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

export const useJobsQuery = () => {
  const { page, rowsPerPage } = useAppSelector(({ pagination }) => pagination);
  const { data, loading, refetch } = useQuery(USER_JOBS);

  const allJobs = data ? data.allJobs : [];
  const currentJobs = allJobs.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );
  const count = allJobs.length;

  return {
    count,
    currentJobs,
    loading,
    refetch,
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
