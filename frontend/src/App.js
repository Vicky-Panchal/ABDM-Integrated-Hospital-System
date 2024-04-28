
import React, { useState, useEffect } from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

// Components
import Home from './components/Home';
import PatientDashboard from './components/PatientDashboard/PatientDashboard';
import DoctorDashboard from './components/DoctorDashboard/DoctorDashboard';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import Login from './components/Login';
import NotFound from './components/NotFound/NotFound';
import SelectOptionPage from './components/SelectOptionPage';
import RegisterPage from './components/RegisterPage';
import DashboardPage from './components/DashboardPage';
import ABDMRegistration from './components/ABDMRegistration';
import ConsentList from './components/DoctorDashboard/ConsentList';
import ConsentRequestForm from './components/DoctorDashboard/ConsentRequestForm'; // ConsentRequestForm
import ConsentRequests from './components/PatientDashboard/ConsentRequests'; // ConsentRequests
import ConsentInfo from './components/PatientDashboard/ConsentInfo'; // ConsentInfo
import ScheduleAppointment from './components/PatientDashboard/ScheduleAppointment'; //ScheduleAppointment
import ProfilePage from './components/ProfilePage';
import ChangePasswordPage from "./components/ChangePasswordPage";
import ForgetPasswordPage from "./components/ForgetPasswordPage";
import Appointment from './components/DoctorDashboard/Appointment';


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
        <Route path="/Login" element={<Login />} />
        <Route path="/SelectOptionPage" element={<SelectOptionPage />} />
        <Route path="/RegisterPage/:option" element={<RegisterPage />} />
        <Route path="/DashboardPage" element={<DashboardPage />} />
        <Route path="/PatientDashboard" element={<PatientDashboard />} />
        <Route path="/DoctorDashboard" element={<DoctorDashboard />} />
        <Route path="/ABDMRegistration" element={<ABDMRegistration />} />
        <Route path="/ConsentList" element={<ConsentList />} />
        <Route path="/ConsentRequestForm" element={<ConsentRequestForm />} />
        <Route path="/ConsentRequests" element={<ConsentRequests />} />
        <Route path="/ConsentInfo" element={<ConsentInfo />} />
        <Route path="/ProfilePage" element={<ProfilePage />} />
        <Route path="/ChangePasswordPage" element={<ChangePasswordPage />} />
        <Route path="/ForgetPasswordPage" element={<ForgetPasswordPage />} /> 
        <Route path="/Appointment" element={<Appointment />} />
        <Route path="/ScheduleAppointment" element={<ScheduleAppointment />} /> 
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
    case 'doctor':
      return <DoctorDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <NotFound />;
  }
};

export default App;
