import {
  Container,
  CssBaseline,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import { useMemo } from "react";
import { Outlet } from "react-router-dom";

import { useAppSelector } from "../../app/hooks";

const SharedLayout = () => {
  const colorMode = useAppSelector(({ appearance }) => appearance.colorMode);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: colorMode,
        },
      }),
    [colorMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl">
        <Typography variant="h3" gutterBottom align="center" sx={{ mt: 2 }}>
          Job Application Tracker
        </Typography>
        <Outlet />
      </Container>
    </ThemeProvider>
  );
};

export default SharedLayout;
