import { useMediaQuery } from "@mui/material";
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";

import {
  LoginPage,
  SignUpPage,
  VerificationPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  JobListPage,
  AddJobPage,
  EditJobPage,
  AuthenticatedLayout,
  UnauthenticatedLayout,
  SharedLayout,
} from "./components";
import { useAppDispatch } from "./app/hooks";
import { initializeColorMode } from "./features/appearance/appearanceSlice";

const App = () => {
  const dispatch = useAppDispatch();
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  useEffect(() => {
    dispatch(initializeColorMode(prefersDarkMode));
  }, [dispatch, prefersDarkMode]);

  return (
    <Routes>
      <Route path="/" element={<SharedLayout />}>
        <Route element={<AuthenticatedLayout />}>
          <Route index element={<JobListPage />} />
          <Route path="create" element={<AddJobPage />} />
          <Route path="jobs/:id" element={<EditJobPage />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Route>
        <Route element={<UnauthenticatedLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignUpPage />} />
          <Route path="verify" element={<VerificationPage />} />
          <Route path="forgot" element={<ForgotPasswordPage />} />
          <Route path="reset" element={<ResetPasswordPage />} />
          <Route path="*" element={<Navigate replace to="/login" />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
