import React from 'react';
import Webcam from 'react-webcam';

import { useNavigate } from 'react-router-dom'; // useNavigate instead of useHistory

const FaceLogin = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  // Navigate to SignUp page
  const handleSignUp = () => {
    navigate('/signup'); // Navigate to SignUp page
  };

  // Navigate to Login page
  const handleLogin = () => {
    navigate('/login'); // Navigate to Login page
  };

  return (
    <div style={styles.container}>
      {/* First Page */}
      <div style={styles.header}>
        <h1>Welcome to the AI-Shongi</h1>
      </div>

      <div style={styles.buttonsContainer}>
        <button onClick={handleSignUp} style={styles.button}>SignUp</button>
        <button onClick={handleLogin} style={styles.button}>Login</button>
      </div>

      <div style={styles.footer}>
        <p>© 2025 AI-Shongi. All Rights Reserved.</p>
      </div>
    </div>
  );
};

// Styles for all components
const styles = {
  container: {
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    marginTop: '50px',
    marginBottom: '30px',
    fontSize: '2rem',
    fontWeight: 'bold',
  },
  buttonsContainer: {
    marginBottom: '30px',
  },
  button: {
    padding: '15px 30px',
    fontSize: '1rem',
    margin: '10px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  footer: {
    marginTop: '50px',
    fontSize: '0.9rem',
    color: '#555',
  }
};

export default FaceLogin;
