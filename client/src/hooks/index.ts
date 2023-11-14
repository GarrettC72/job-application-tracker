import { useCallback, useState } from "react";
import { AlertColor } from "@mui/material";
import { useQuery } from "@apollo/client";

import { useAppDispatch, useAppSelector } from "../app/hooks";
import { clearUser, initializeUser } from "../features/user/userSlice";
import { setNotification } from "../features/notification/notificationSlice";
import { USER_JOBS } from "../graphql/queries";
import { convertDate } from "../utils";

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
  const { page, rowsPerPage, filter } = useAppSelector(
    ({ pagination }) => pagination
  );
  const { data, loading, refetch } = useQuery(USER_JOBS);

  const allJobs = data ? data.allJobs : [];
  const filteredJobs = allJobs.filter((job) =>
    job.companyName.toLowerCase().includes(filter.toLowerCase())
  );
  const jobsToDisplay = filteredJobs
    .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
    .map((job) => ({
      ...job,
      dateCreated: convertDate(job.dateCreated),
      lastModified: convertDate(job.lastModified),
    }));
  const count = filteredJobs.length;

  return {
    count,
    jobsToDisplay,
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
