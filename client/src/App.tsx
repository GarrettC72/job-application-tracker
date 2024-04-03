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
import useInitialization from "./hooks/useInitialization";

const App = () => {
  const initializeState = useInitialization();

  useEffect(() => {
    initializeState();
  }, [initializeState]);

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
