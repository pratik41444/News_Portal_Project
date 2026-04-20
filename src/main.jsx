// ============================================================================
// main.jsx - Application Entry Point
// ============================================================================
// This is the bootstrap file that initializes the React application.
// It renders the root App component into the DOM element with id="root".
// ============================================================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css'; // Import global styles

// Create React root and render App component
// StrictMode enables additional development checks and warnings
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
