import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect } from "react";

import { useClearUser, useInitialization, useNotification } from "./hooks";
import { useAppSelector } from "./app/hooks";
import LoginPage from "./components/LoginPage";
import SignUpPage from "./components/SignUpPage";
import VerificationPage from "./components/VerificationPage";
import ForgotPasswordPage from "./components/ForgotPasswordPage";
import ResetPasswordPage from "./components/ResetPasswordPage";
import Notification from "./components/Notification";

const App = () => {
  const initializeState = useInitialization();
  const clearUser = useClearUser();
  const notifyWith = useNotification();

  const user = useAppSelector(({ user }) => user);

  useEffect(() => {
    initializeState();
  }, [initializeState]);

  const logout = () => {
    clearUser();
    notifyWith("Logged out", "success");
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
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <button onClick={logout}>Logout</button>
              <div>Logged in as {user.name}</div>
            </div>
          }
        />
        <Route path="/reset" element={<ResetPasswordPage />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
