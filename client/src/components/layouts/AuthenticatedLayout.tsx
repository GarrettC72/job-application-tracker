import { Logout } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { Navigate, Outlet } from "react-router-dom";
import { useApolloClient, useSubscription } from "@apollo/client";

import { getFragmentData } from "../../__generated__/fragment-masking";
import {
  JOB_ADDED,
  JOB_DELETED,
  JOB_UPDATED,
} from "../../graphql/subscriptions";
import { FULL_JOB_DETAILS, JOB_DETAILS } from "../../graphql/fragments";
import { addJobToCache, removeJobFromCache } from "../../utils/cache";
import useClearUser from "../../hooks/useClearUser";
import useCurrentUser from "../../hooks/useCurrentUser";
import useNotification from "../../hooks/useNotification";
import storageService from "../../services/storage";
import Notification from "../../features/notification/Notification";
import ColorMode from "../../features/appearance/ColorMode";
import Loading from "../Loading";
import ServerResponse from "../ServerResponse";

const AuthenticatedLayout = () => {
  const { currentUser, loading, error } = useCurrentUser();
  const clearUser = useClearUser();
  const notifyWith = useNotification();
  const client = useApolloClient();

  useSubscription(JOB_ADDED, {
    skip: !currentUser,
    onData: ({ data, client }) => {
      if (data.data) {
        const jobAdded = data.data.jobAdded;
        const jobFragment = getFragmentData(JOB_DETAILS, jobAdded);
        if (currentUser && currentUser.email === jobAdded.user.email) {
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
    skip: !currentUser,
    onData: ({ data, client }) => {
      if (data.data) {
        const jobUpdated = data.data.jobUpdated;
        const jobFragment = getFragmentData(FULL_JOB_DETAILS, jobUpdated);
        if (currentUser && currentUser.email === jobUpdated.user.email) {
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
    skip: !currentUser,
    onData: ({ data, client }) => {
      if (data.data) {
        const jobDeleted = data.data.jobDeleted;
        removeJobFromCache(client.cache, jobDeleted.id);
        if (currentUser && currentUser.email === jobDeleted.user.email) {
          notifyWith(
            `Job '${jobDeleted.jobTitle} at ${jobDeleted.companyName}' was deleted`,
            "success"
          );
        }
      }
    },
  });

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ServerResponse />;
  }

  if (!currentUser) {
    storageService.removeUser();
    return <Navigate to="/login" replace={true} />;
  }

  const logout = () => {
    clearUser();
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
