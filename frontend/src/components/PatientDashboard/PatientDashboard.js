// PatientDashboard.js
import React from "react";
import { Link } from "react-router-dom";
import "../../Styles/patientDashboard.css";
import Navbar from "../navbar";

const PatientDashboard = () => {
  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        <div className="row1">
          <button className="component">ABDM Registration</button>
          <button className="component">Lab Tests</button>
          <button className="component">Requests</button>
        </div>
        <div className="row2">
          <button className="component">Documents</button>
          <button className="component">Upload Documents</button>
          <button className="component">Appointment Scheduling</button>
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
