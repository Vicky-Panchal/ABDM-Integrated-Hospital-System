// DashboardPage.js

import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/dashboardPage.css'; // Import the CSS file

const DashboardPage = () => {
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-heading">Dashboard</h1>
      <ul className="dashboard-list">
        <li className="dashboard-item">
          <Link to="/ABDMRegistration" className="dashboard-link">ABDM Registration</Link>
        </li>
        <li className="dashboard-item">
          <Link to="/DocUpload" className="dashboard-link">Doc Upload</Link>
        </li>
        <li className="dashboard-item">
          <Link to="/DocDownload" className="dashboard-link">Doc Download</Link>
        </li>
      </ul>
    </div>
  );
};

export default DashboardPage;
