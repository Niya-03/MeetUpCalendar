// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import CalendarPage from './CalendarPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/calendar/:sessionId" element={<CalendarPage />} />
      </Routes>
    </Router>
  );
}

export default App;
