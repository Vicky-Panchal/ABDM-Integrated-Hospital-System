// AdminDashboard.js
import React, { useEffect, useState } from "react";
import AppointmentsBooked from "./AppointmentsBooked";
import ViewAllPatients from "./ViewAllPatients";
import ViewAllDoctors from "./ViewAllDoctors";
import Navbar from "../navbar";
import "../../Styles/AdminDashboard/adminDashboard.css";

const AdminDashboard = () => {
  const [selectedButton, setSelectedButton] = useState(null);

  useEffect(() => {
    setSelectedButton("appointments");
  }, []);

  const handleButtonClick = (buttonId) => {
    setSelectedButton(buttonId);
  };

  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div className="admin-dashboard-container">
        <div className="functionalities">
          <div>
            <button
              className={selectedButton === "patients" ? "active" : ""}
              onClick={() => handleButtonClick("patients")}
            >
              View All Patients
            </button>
          </div>
          <div>
            <button
              className={selectedButton === "doctors" ? "active" : ""}
              onClick={() => handleButtonClick("doctors")}
            >
              View All Doctors
            </button>
          </div>
          <div>
            <button
              className={selectedButton === "appointments" ? "active" : ""}
              onClick={() => handleButtonClick("appointments")}
            >
              Appointments Booked
            </button>
          </div>
          <div>
            <button
              className={selectedButton === "documents" ? "active" : ""}
              onClick={() => handleButtonClick("documents")}
            >
              Document Sharing History
            </button>
          </div>
          <div>
            <button
              className={selectedButton === "logs" ? "active" : ""}
              onClick={() => handleButtonClick("logs")}
            >
              Logs
            </button>
          </div>
        </div>
        <div className="content">
          {selectedButton === "patients" && <ViewAllPatients />}
          {selectedButton === "doctors" && <ViewAllDoctors />}
          {selectedButton === "appointments" && <AppointmentsBooked />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
