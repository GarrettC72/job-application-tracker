import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import VerificationPage from './components/VerificationPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';

const App = () => {
  return (
    <Router>
      <h1>Job Application Tracker</h1>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/verify" element={<VerificationPage />} />
        <Route path="/forgot" element={<ForgotPasswordPage />} />
      </Routes>
    </Router>
  );
};

export default App;
