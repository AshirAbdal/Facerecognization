import React from 'react';
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  // Navigate to FaceScanPage for face verification
  const handleFaceScan = () => {
    navigate('/face-scan'); // Navigate to FaceScanPage for face verification
  };

  return (
    <div style={styles.container}>
      <h1>Sign Up - Verify your Face</h1>

      <div style={styles.faceScanContainer}>
        <button onClick={handleFaceScan} style={styles.button}>
          Start Face Scan for SignUp
        </button>
      </div>

      <div style={styles.footer}>
        <p>© 2025 AI-Shongi. All Rights Reserved.</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
  },
  faceScanContainer: {
    marginTop: '20px',
  },
  button: {
    padding: '15px 30px',
    fontSize: '1rem',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  footer: {
    marginTop: '50px',
    fontSize: '0.9rem',
    color: '#555',
  },
};

export default SignUpPage;
