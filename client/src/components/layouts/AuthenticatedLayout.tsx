import { Logout } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { useApolloClient, useSubscription } from "@apollo/client";
import { Navigate, Outlet } from "react-router";

import {
  JOB_ADDED,
  JOB_DELETED,
  JOB_UPDATED,
} from "../../graphql/subscriptions";
import { addJobToCache, removeJobFromCache } from "../../utils/cache";
import useCurrentUser from "../../hooks/useCurrentUser";
import useNotification from "../../hooks/useNotification";
import storageService from "../../services/storage";
import Notification from "../../features/notification/Notification";
import ColorMode from "../../features/appearance/ColorMode";
import Loading from "../Loading";
import ServerResponse from "../ServerResponse";

const AuthenticatedLayout = () => {
  const { currentUser, loading, error } = useCurrentUser();
  const notifyWith = useNotification();
  const client = useApolloClient();

  useSubscription(JOB_ADDED, {
    skip: !currentUser,
    onData: ({ data, client }) => {
      if (data.data) {
        const jobAdded = data.data.jobAdded;
        addJobToCache(client.cache, jobAdded);
        notifyWith(
          `New job '${jobAdded.jobTitle} at ${jobAdded.companyName}' was added`,
          "success"
        );
      }
    },
  });

  useSubscription(JOB_UPDATED, {
    skip: !currentUser,
    onData: ({ data, client }) => {
      if (data.data) {
        const jobUpdated = data.data.jobUpdated;
        const id = client.cache.identify({
          __typename: "Job",
          id: jobUpdated.id,
        });
        client.cache.evict({ id, fieldName: "user" });
        notifyWith(
          `Job '${jobUpdated.jobTitle} at ${jobUpdated.companyName}' was updated`,
          "success"
        );
      }
    },
  });

  useSubscription(JOB_DELETED, {
    skip: !currentUser,
    onData: ({ data, client }) => {
      if (data.data) {
        const jobDeleted = data.data.jobDeleted;
        removeJobFromCache(client.cache, jobDeleted.id);
        notifyWith(
          `Job '${jobDeleted.jobTitle} at ${jobDeleted.companyName}' was deleted`,
          "success"
        );
      }
    },
  });

  if (loading) {
    return <Loading />;
  }

  if (error) {
    const networkError = error.networkError;
    if (
      networkError &&
      "result" in networkError &&
      typeof networkError.result === "object" &&
      networkError.result.errors &&
      Array.isArray(networkError.result.errors)
    ) {
      const graphQlError = networkError.result.errors[0];
      if (
        graphQlError &&
        graphQlError.extensions &&
        graphQlError.extensions.code &&
        typeof graphQlError.extensions.code === "string" &&
        graphQlError.extensions.code === "INVALID_TOKEN"
      ) {
        storageService.removeToken();
        return <Navigate to="/login" replace={true} />;
      }
    }
    return <ServerResponse />;
  }

  if (!currentUser) {
    storageService.removeToken();
    return <Navigate to="/login" replace={true} />;
  }

  const logout = () => {
    storageService.removeToken();
    notifyWith("Logged out", "info");
    client.resetStore();
  };

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Typography variant="body1" sx={{ flexGrow: 1 }}>
          {`${currentUser.firstName} ${currentUser.lastName}`} logged in{" "}
          <Button onClick={logout} variant="contained" startIcon={<Logout />}>
            Logout
          </Button>
        </Typography>
        <ColorMode />
      </Box>
      <Notification />
      <Outlet />
    </>
  );
};

export default AuthenticatedLayout;
