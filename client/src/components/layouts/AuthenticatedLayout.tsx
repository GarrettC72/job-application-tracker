import { Logout } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { Navigate, Outlet } from "react-router-dom";
import { useApolloClient } from "@apollo/client";

import useClearUser from "../../hooks/useClearUser";
import useCurrentUser from "../../hooks/useCurrentUser";
import useNotification from "../../hooks/useNotification";
import storageService from "../../services/storage";
import Notification from "../../features/notification/Notification";
import ColorMode from "../../features/appearance/ColorMode";
import Loading from "../Loading";

const AuthenticatedLayout = () => {
  const { currentUser, loading } = useCurrentUser();
  const clearUser = useClearUser();
  const notifyWith = useNotification();
  const client = useApolloClient();

  if (loading) {
    return <Loading />;
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
