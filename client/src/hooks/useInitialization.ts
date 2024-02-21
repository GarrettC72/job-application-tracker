import { useCallback } from "react";
import { useMediaQuery } from "@mui/material";

import { useAppDispatch } from "../app/hooks";
import { initializeUser } from "../features/user/userSlice";
import { initializeColorMode } from "../features/appearance/appearanceSlice";

const useInitialization = () => {
  const dispatch = useAppDispatch();
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  return useCallback(() => {
    dispatch(initializeUser());
    dispatch(initializeColorMode(prefersDarkMode));
  }, [dispatch, prefersDarkMode]);
};

export default useInitialization;
