import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FaceLogin from './FaceLogin';
import SignUpPage from './SignUpPage';
import LoginPage from './LoginPage';
import FaceScanPage from './FaceScanPage'; // Add FaceScanPage route

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FaceLogin />} />
        <Route path="/signup" element={<SignUpPage />} /> {/* SignUp Page */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/face-scan" element={<FaceScanPage />} /> {/* Face Scan Page */}
      </Routes>
    </Router>
  );
}

export default App;


