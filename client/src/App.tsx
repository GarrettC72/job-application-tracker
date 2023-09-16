import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';

import { useClearUser, useInitialization } from './hooks';
import { useAppSelector } from './app/hooks';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import VerificationPage from './components/VerificationPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ResetPasswordPage from './components/ResetPasswordPage';

const App = () => {
  const initializeState = useInitialization();
  const clearUser = useClearUser();

  const user = useAppSelector((state) => state.user.value);

  useEffect(() => {
    initializeState();
  }, [initializeState]);

  const logout = () => {
    clearUser();
  };

  if (!user) {
    return (
      <Router>
        <h1>Job Application Tracker</h1>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/verify" element={<VerificationPage />} />
          <Route path="/forgot" element={<ForgotPasswordPage />} />
          <Route path="/reset" element={<ResetPasswordPage />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <h1>Job Application Tracker</h1>
      <button onClick={logout}>Logout</button>
      <div>Logged in as {user.name}</div>
    </Router>
  );
};

export default App;
