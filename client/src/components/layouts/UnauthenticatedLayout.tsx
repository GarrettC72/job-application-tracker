import { Box } from "@mui/material";
import { Navigate, Outlet } from "react-router-dom";

import ColorMode from "../../features/appearance/ColorMode";
import Notification from "../../features/notification/Notification";
import useCurrentUser from "../../hooks/useCurrentUser";
import Loading from "../Loading";

const UnauthenticatedLayout = () => {
  const { currentUser, loading } = useCurrentUser();

  if (loading) {
    return <Loading />;
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
