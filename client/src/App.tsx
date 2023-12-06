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
import { addJobToCache } from "./utils/cache";
import { useClearUser, useInitialization, useNotification } from "./hooks";
import { useAppSelector } from "./app/hooks";
import { JOB_ADDED } from "./graphql/subscriptions";
import { JOB_DETAILS } from "./graphql/fragments";

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
        const jobAdded = getFragmentData(JOB_DETAILS, data.data.jobAdded);
        if (user !== null && user.email === data.data.jobAdded.user.email) {
          addJobToCache(client.cache, jobAdded);
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
