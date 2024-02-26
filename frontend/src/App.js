
import React, { useState, useEffect } from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

// Components
import Home from './components/Home';
import PatientDashboard from './components/PatientDashboard/PatientDashboard';
import ClinicDashboard from './components/ClinicDashboard/ClinicDashboard';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import Login from './components/Login';
import NotFound from './components/NotFound/NotFound';
import SelectOptionPage from './components/SelectOptionPage';
import RegisterPage from './components/RegisterPage';
import DashboardPage from './components/DashboardPage';

const App = () => {
  const [userState, setUserState] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // useEffect(() => {
  //   // Fetch user state from backend
  //   axios.get('/api/user/state')
  //     .then(response => {
  //       setUserState(response.data.state);
  //       setIsLoggedIn(response.data.isLoggedIn);
  //     })
  //     .catch(error => {
  //       console.error('Error fetching user state:', error);
  //     });
  // }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/selectoption" element={<SelectOptionPage />} />
        <Route path="/register/:option" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
      </Routes>
    </Router>
  );
};

// Separate component for rendering Dashboard based on user state
const Dashboard = ({ userState, isLoggedIn }) => {
  if (!isLoggedIn) {
    // Redirect to login if not logged in
    return <Navigate to="/login" />;
  }

  switch (userState) {
    case 'patient':
      return <PatientDashboard />;
    case 'clinic':
      return <ClinicDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <NotFound />;
  }
};

export default App;
