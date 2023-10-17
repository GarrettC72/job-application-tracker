import { useCallback, useState } from "react";
import { AlertColor } from "@mui/material";
import { useQuery } from "@apollo/client";

import { useAppDispatch } from "../app/hooks";
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

export const useJobs = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const jobs = useQuery(USER_JOBS);

  const allJobs = jobs.data ? jobs.data.allJobs : [];
  const currentJobs = allJobs.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );
  const count = allJobs.length;

  const onPageChange = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const onRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const jobsPaginationInfo = {
    count,
    rowsPerPage,
    page,
    onPageChange,
    onRowsPerPageChange,
  };

  return {
    currentJobs,
    jobsPaginationInfo,
    loading: jobs.loading,
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
