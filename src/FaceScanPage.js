import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import { useNavigate } from 'react-router-dom';
import * as tf from '@tensorflow/tfjs';

const FaceScanPage = () => {
  const [isFaceVerified, setIsFaceVerified] = useState(false);
  const [message, setMessage] = useState('Preparing camera...');
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [modelLoadAttempts, setModelLoadAttempts] = useState(0);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  tf.setBackend('webgl').then(() => {
    // Proceed with loading models once TensorFlow.js is initialized
    loadModels();
  });  

  // Load models for face-api.js
  const loadModels = async () => {
    try {
      console.log('Loading models...');
      setMessage('Loading face detection models...');
      
      // Use the correct path to your model files - this is likely the issue
      // The models should be in your public folder
      const MODEL_URL = process.env.PUBLIC_URL + '/models';
      // Alternative path if your models are in a different location
      // const MODEL_URL = './models';
      
      console.log('Loading models from path:', MODEL_URL);
      
      // Load models sequentially with proper error handling
      await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL).catch(e => {
        throw new Error(`Failed to load ssdMobilenetv1: ${e.message}`);
      });
      console.log('Loaded ssdMobilenetv1');
      
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL).catch(e => {
        throw new Error("Failed to load faceLandmark68Net: ${e.message}");
      });
      console.log('Loaded faceLandmark68Net');
      
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL).catch(e => {
        throw new Error("Failed to load faceRecognitionNet: ${e.message}");
      });
      console.log('Loaded faceRecognitionNet');
      
      console.log('All models loaded successfully!');
      setMessage('Models loaded successfully! Look at the camera.');
      setIsModelLoaded(true);
    } catch (e) {
      console.error('Error loading models:', e);
      setError(`Failed to load face detection models: ${e.message}. Please check console for details.`);

      setMessage('Error loading models');
    }
  };

  // Handle face detection and verification
  const handleDetectFace = async () => {
    if (!webcamRef.current || !webcamRef.current.video || !webcamRef.current.video.readyState == 4) {
      console.log("Video is not ready yet");
      return;
    }

    try {
      console.log("Starting face detection...");
      
      // Detect face from webcam video stream
      const detections = await faceapi.detectSingleFace(
        webcamRef.current.video,
        new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 })
      ).withFaceLandmarks().withFaceDescriptors();

      console.log("Face detections:", detections);

      // Create or use existing canvas
      let canvas = canvasRef.current;
      if (!canvas) {
        canvas = faceapi.createCanvasFromMedia(webcamRef.current.video);
        canvas.id = 'face-detection-canvas';
        canvas.style.position = 'absolute';
        canvas.style.top = webcamRef.current.video.offsetTop + 'px';
        canvas.style.left = webcamRef.current.video.offsetLeft + 'px';
        document.getElementById('webcam-container').appendChild(canvas);
        canvasRef.current = canvas;
      }

      // Draw detections if found
      const displaySize = { 
        width: webcamRef.current.video.width, 
        height: webcamRef.current.video.height 
      };
      faceapi.matchDimensions(canvas, displaySize);

      if (detections) {
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

        setIsFaceVerified(true);
        setMessage('Face detected! Successfully signed up to AI-Shongi!');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        // No face detected, clear canvas and retry
        if (canvas.getContext) {
          canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        }
        setMessage('No face detected. Please ensure your face is visible.');
      }
    } catch (err) {
      console.error("Error in face detection:", err);
      setError('Error during face detection: ' + err.message);
    }
  };

  // Load models on component mount with retry mechanism
  useEffect(() => {
    const attemptModelLoading = async () => {
      try {
        await loadModels();
      } catch (err) {
        console.error('Model loading attempt failed:', err);
        
        // If we haven't tried too many times, retry after a delay
        if (modelLoadAttempts < 3) {
          setModelLoadAttempts(prev => prev + 1);
          setMessage(`Retrying model load (attempt ${modelLoadAttempts + 1}/3)...`);
          setModelLoadAttempts(prev => prev + 1);  // Correctly update the attempts

          setTimeout(attemptModelLoading, 2000); // Wait 2 seconds before retrying
        } else {
          setError('Failed to load models after multiple attempts. Please check your network connection and model path.');
        }
      }
    };
    
    attemptModelLoading();
  }, [modelLoadAttempts]);

  // Start detection when models are loaded and webcam is ready
  useEffect(() => {
    const detectInterval = setInterval(() => {
      if (isModelLoaded && webcamRef.current && webcamRef.current.video && webcamRef.current.video.readyState === 4) {
        handleDetectFace();
      }
    }, 1000); // Check for a face every second

    return () => clearInterval(detectInterval);
  }, [isModelLoaded]);

  return (
    <div style={styles.container}>
      <h1>Sign Up - Face Scan</h1>
      
      {error && (
        <div style={styles.error}>
          <p>{error}</p>
          <button 
            onClick={() => {
              setError(null);
              setModelLoadAttempts(0); // Reset attempt counter
              setMessage('Retrying model loading...');
            }}
            style={styles.retryButton}
          >
            Retry Loading Models
          </button>
        </div>
      )}

      <div id="webcam-container" style={styles.webcamContainer}>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={640}
          height={480}
          videoConstraints={{
            width: 640,
            height: 480,
            facingMode: "user",
          }}
        />
      </div>

      <div style={styles.faceStatus}>
        <h2>{message}</h2>
        {isModelLoaded && !isFaceVerified && (
          <p>Waiting to detect your face. Please ensure you're in good lighting.</p>
        )}
      </div>

      <div style={styles.footer}>
        <button onClick={() => navigate('/')} style={styles.button}>Back to Home</button>
        <p>© 2025 AI-Shongi. All Rights Reserved.</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
  },
  webcamContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
    position: 'relative',
  },
  faceStatus: {
    marginTop: '20px',
    fontSize: '1.2rem',
  },
  error: {
    color: 'red',
    marginBottom: '15px',
    padding: '15px',
    backgroundColor: '#ffeeee',
    borderRadius: '5px',
    border: '1px solid #ffcccc',
  },
  retryButton: {
    padding: '8px 16px',
    backgroundColor: '#4285f4',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  footer: {
    marginTop: '50px',
    fontSize: '0.9rem',
    color: '#555',
  },
  button: {
    padding: '10px 20px',
    fontSize: '1rem',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '15px',
  }
};

export default FaceScanPage;