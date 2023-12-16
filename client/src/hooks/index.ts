import { useCallback, useState } from "react";
import { AlertColor, useMediaQuery } from "@mui/material";
import { useQuery } from "@apollo/client";

import { useAppDispatch, useAppSelector } from "../app/hooks";
import { clearUser, initializeUser } from "../features/user/userSlice";
import { setNotification } from "../features/notification/notificationSlice";
import { initializeColorMode } from "../features/appearance/appearanceSlice";
import { USER_JOBS } from "../graphql/queries";
import { JOB_DETAILS } from "../graphql/fragments";
import { convertDate } from "../utils/parser";
import { getFragmentData } from "../__generated__/fragment-masking";

export const useInitialization = () => {
  const dispatch = useAppDispatch();
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  return useCallback(() => {
    dispatch(initializeUser());
    dispatch(initializeColorMode(prefersDarkMode));
  }, [dispatch, prefersDarkMode]);
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
  const filteredJobs = allJobs.filter((job) => {
    const unmaskedJob = getFragmentData(JOB_DETAILS, job);
    return unmaskedJob.companyName.toLowerCase().includes(filter.toLowerCase());
  });
  const jobsToDisplay = filteredJobs
    .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
    .map((job) => {
      const unmaskedJob = getFragmentData(JOB_DETAILS, job);
      return {
        ...unmaskedJob,
        dateCreated: convertDate(unmaskedJob.dateCreated),
        lastModified: convertDate(unmaskedJob.lastModified),
      };
    });
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
