import { Routes, Route, Navigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  CssBaseline,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import { Logout } from "@mui/icons-material";
import { useEffect, useMemo } from "react";
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
import { JOB_ADDED, JOB_DELETED, JOB_UPDATED } from "./graphql/subscriptions";
import { FULL_JOB_DETAILS, JOB_DETAILS } from "./graphql/fragments";
import ColorMode from "./features/appearance/ColorMode";

const App = () => {
  const initializeState = useInitialization();
  const clearUser = useClearUser();
  const notifyWith = useNotification();
  const client = useApolloClient();

  const { user, appearance } = useAppSelector(({ user, appearance }) => ({
    user,
    appearance,
  }));

  useEffect(() => {
    initializeState();
  }, [initializeState]);

  useSubscription(JOB_ADDED, {
    skip: !user,
    onData: ({ data, client }) => {
      if (data.data) {
        const jobAdded = data.data.jobAdded;
        const jobFragment = getFragmentData(JOB_DETAILS, jobAdded);
        if (user && user.email === jobAdded.user.email) {
          notifyWith(
            `New job '${jobFragment.jobTitle} at ${jobFragment.companyName}' was added`,
            "success"
          );
          addJobToCache(client.cache, jobAdded);
        } else {
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
          notifyWith(
            `Job '${jobFragment.jobTitle} at ${jobFragment.companyName}' was updated`,
            "success"
          );
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

  useSubscription(JOB_DELETED, {
    skip: !user,
    onData: ({ data, client }) => {
      if (data.data) {
        const jobDeleted = data.data.jobDeleted;
        removeJobFromCache(client.cache, jobDeleted.id);
        if (user && user.email === jobDeleted.user.email) {
          notifyWith(
            `Job '${jobDeleted.jobTitle} at ${jobDeleted.companyName}' was deleted`,
            "success"
          );
        }
      }
    },
  });

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: appearance.colorMode,
        },
      }),
    [appearance.colorMode]
  );

  const logout = () => {
    clearUser();
    notifyWith("Logged out", "info");
    client.resetStore();
  };

  const getAppContent = () => {
    if (!user) {
      return (
        <>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <ColorMode />
          </Box>
          <Notification />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/verify" element={<VerificationPage />} />
            <Route path="/forgot" element={<ForgotPasswordPage />} />
            <Route path="/reset" element={<ResetPasswordPage />} />
            <Route path="*" element={<Navigate replace to="/" />} />
          </Routes>
        </>
      );
    } else {
      return (
        <>
          <Box sx={{ display: "flex" }}>
            <Typography variant="body1" sx={{ flexGrow: 1 }}>
              {user.name} logged in{" "}
              <Button
                onClick={logout}
                variant="contained"
                startIcon={<Logout />}
              >
                Logout
              </Button>
            </Typography>
            <ColorMode />
          </Box>
          <Notification />
          <Routes>
            <Route path="/" element={<JobListPage />} />
            <Route path="/create" element={<AddJobPage />} />
            <Route path="/jobs/:id" element={<EditJobPage />} />
            <Route path="*" element={<Navigate replace to="/" />} />
          </Routes>
        </>
      );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl">
        <Typography variant="h3" gutterBottom align="center" sx={{ mt: 2 }}>
          Job Application Tracker
        </Typography>
        {getAppContent()}
      </Container>
    </ThemeProvider>
  );
};

export default App;
