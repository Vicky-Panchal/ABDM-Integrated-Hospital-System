// DoctorDashboard.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../Styles/DoctorDashboard/doctorDashboard.css";
import Navbar from "../navbar";

const DoctorDashboard = () => {
  
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        <div className="row1">
          <button className="component" onClick={() => {navigate("/ABDMRegistration");}}>ABDM Registration</button>
          <button className="component" onClick={() => {navigate("/ConsentList");}}>Consent List</button>
          <button className="component" onClick={() => {navigate("/Appointment");}}>Appointment</button>
        </div>
        <div className="row2">
          <button className="component">View Documents</button>
          <button className="component" onClick={() => {navigate("/AddVisit");}}>Add Visit</button>
          <button className="component">Clinic</button>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;

