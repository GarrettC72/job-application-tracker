import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect } from "react";
import { useApolloClient } from "@apollo/client";

import { useClearUser, useInitialization, useNotification } from "./hooks";
import { useAppSelector } from "./app/hooks";
import LoginPage from "./components/LoginPage";
import SignUpPage from "./components/SignUpPage";
import VerificationPage from "./components/VerificationPage";
import ForgotPasswordPage from "./components/ForgotPasswordPage";
import ResetPasswordPage from "./components/ResetPasswordPage";
import Notification from "./components/Notification";
import JobListPage from "./components/JobListPage";

const App = () => {
  const initializeState = useInitialization();
  const clearUser = useClearUser();
  const notifyWith = useNotification();
  const client = useApolloClient();

  const user = useAppSelector(({ user }) => user);

  useEffect(() => {
    initializeState();
  }, [initializeState]);

  const logout = () => {
    clearUser();
    notifyWith("Logged out", "success");
    client.resetStore();
  };

  if (!user) {
    return (
      <Router>
        <h1>Job Application Tracker</h1>
        <Notification />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/verify" element={<VerificationPage />} />
          <Route path="/forgot" element={<ForgotPasswordPage />} />
          <Route path="/reset" element={<ResetPasswordPage />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <h1>Job Application Tracker</h1>
      <Notification />
      <div>
        {user.name} logged in <button onClick={logout}>Logout</button>
      </div>
      <Routes>
        <Route path="/" element={<JobListPage />} />
        <Route path="/reset" element={<ResetPasswordPage />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
