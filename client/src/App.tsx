import { Routes, Route, Navigate } from "react-router-dom";
import { Button, Container, Typography } from "@mui/material";
import { Logout } from "@mui/icons-material";
import { useEffect } from "react";
import { useApolloClient, useSubscription } from "@apollo/client";

import {
  LoginPage,
  SignUpPage,
  VerificationPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  JobListPage,
  AddJobPage,
  EditJobPage,
  Notification,
} from "./components";
import { getFragmentData } from "./__generated__";
import { addJobToCache, removeJobFromCache } from "./utils/cache";
import { useClearUser, useInitialization, useNotification } from "./hooks";
import { useAppSelector } from "./app/hooks";
import { JOB_ADDED, JOB_UPDATED } from "./graphql/subscriptions";
import { FULL_JOB_DETAILS, JOB_DETAILS } from "./graphql/fragments";

const App = () => {
  const initializeState = useInitialization();
  const clearUser = useClearUser();
  const notifyWith = useNotification();
  const client = useApolloClient();

  const user = useAppSelector(({ user }) => user);

  useEffect(() => {
    initializeState();
  }, [initializeState]);

  useSubscription(JOB_ADDED, {
    skip: !user,
    onData: ({ data, client }) => {
      if (data.data) {
        const jobAdded = data.data.jobAdded;
        if (user && user.email === jobAdded.user.email) {
          addJobToCache(client.cache, jobAdded);
        } else {
          const jobFragment = getFragmentData(JOB_DETAILS, jobAdded);
          removeJobFromCache(client.cache, jobFragment.id);
        }
      }
    },
  });

  useSubscription(JOB_UPDATED, {
    skip: !user,
    onData: ({ data, client }) => {
      if (data.data) {
        const jobUpdated = data.data.jobUpdated;
        const jobFragment = getFragmentData(FULL_JOB_DETAILS, jobUpdated);
        if (user && user.email === jobUpdated.user.email) {
          const id = client.cache.identify({
            __typename: "Job",
            id: jobFragment.id,
          });
          client.cache.evict({ id, fieldName: "user" });
        } else {
          removeJobFromCache(client.cache, jobFragment.id);
        }
      }
    },
  });

  const logout = () => {
    clearUser();
    notifyWith("Logged out", "info");
    client.resetStore();
  };

  if (!user) {
    return (
      <Container maxWidth="xl">
        <Typography variant="h3" gutterBottom align="center" sx={{ mt: 2 }}>
          Job Application Tracker
        </Typography>
        <Notification />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/verify" element={<VerificationPage />} />
          <Route path="/forgot" element={<ForgotPasswordPage />} />
          <Route path="/reset" element={<ResetPasswordPage />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Typography variant="h3" gutterBottom align="center" sx={{ mt: 2 }}>
        Job Application Tracker
      </Typography>
      <Notification />
      <Typography variant="body1" align="center">
        {user.name} logged in{" "}
        <Button onClick={logout} variant="contained" startIcon={<Logout />}>
          Logout
        </Button>
      </Typography>
      <Routes>
        <Route path="/" element={<JobListPage />} />
        <Route path="/create" element={<AddJobPage />} />
        <Route path="/jobs/:id" element={<EditJobPage />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </Container>
  );
};

export default App;
