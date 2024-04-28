// PatientDashboard.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../Styles/PatientDashboard/patientDashboard.css";
import Navbar from "../navbar";

const PatientDashboard = () => {
  
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        <div className="row1">
          <button className="component" onClick={() => {navigate("/ABDMRegistration");}}>ABDM Registration</button>
          <button className="component" onClick={() => {navigate("/ConsentRequests");}}>Consent Requests</button>
          <button className="component">Schedule Appointment</button>
          
        </div>
        <div className="row2">
          <button className="component">View Documents</button>
          <button className="component">Upload Documents</button>
          <button className="component">Lab Tests</button>
        </div>
      </div>
    </div>

    // <div>
    //   <h2>Patient Dashboard</h2>
    //   {/* Add your patient dashboard content here */}
    //   <div className="dashboard-container">
    //   <h1 className="dashboard-heading">Dashboard</h1>
    //   <ul className="dashboard-list">
    //     <li className="dashboard-item">
    //       <Link to="/abdm-registration" className="dashboard-link">ABDM Registration</Link>
    //     </li>
    //     <li className="dashboard-item">
    //       <Link to="/doc-upload" className="dashboard-link">Doc Upload</Link>
    //     </li>
    //     <li className="dashboard-item">
    //       <Link to="/doc-download" className="dashboard-link">Doc Download</Link>
    //     </li>
    //   </ul>
    // </div>
    // </div>
  );
};

export default PatientDashboard;
