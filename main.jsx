import React from 'react';
import { createRoot } from 'react-dom/client';
import StayDryPlatform from './App.jsx';
import './style.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StayDryPlatform />
  </React.StrictMode>
);
