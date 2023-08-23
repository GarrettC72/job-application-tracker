import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import VerificationPage from './components/VerificationPage';

const App = () => {
  return (
    <Router>
      <h1>Job Application Tracker</h1>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/verify" element={<VerificationPage />} />
      </Routes>
    </Router>
  );
};

export default App;
