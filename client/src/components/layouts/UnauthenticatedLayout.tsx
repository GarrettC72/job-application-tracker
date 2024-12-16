import { Box } from "@mui/material";
import { Navigate, Outlet } from "react-router";

import ColorMode from "../../features/appearance/ColorMode";
import Notification from "../../features/notification/Notification";
import useCurrentUser from "../../hooks/useCurrentUser";
import Loading from "../Loading";
import ServerResponse from "../ServerResponse";

const UnauthenticatedLayout = () => {
  const { currentUser, loading, error } = useCurrentUser();

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ServerResponse />;
  }

  if (currentUser !== null && currentUser !== undefined) {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <ColorMode />
      </Box>
      <Notification />
      <Outlet />
    </>
  );
};

export default UnauthenticatedLayout;
