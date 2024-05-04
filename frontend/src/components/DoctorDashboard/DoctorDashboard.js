// DoctorDashboard.js
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ConsentList from "./ConsentList";
import Appointment from "./Appointment";
import AddVisit from "./AddVisit";
import "../../Styles/DoctorDashboard/doctorDashboard.css";
import Navbar from "../navbar";

const DoctorDashboard = () => {
  
  const navigate = useNavigate();

  const [selectedButton, setSelectedButton] = useState(null);

  useEffect(() => {
    setSelectedButton("consentList");
  }, []);

  const handleButtonClick = (buttonId) => {
    setSelectedButton(buttonId);
  };

  return (
    <div>
      <div>
        <Navbar />
      </div>

      <div className="doctor-dashboard-container">
      <div className="functionalities">
          <div>
            <button
              className={selectedButton === "abdmRegistraion" ? "active" : ""}
              onClick={() => {navigate("/ABDMRegistration")}}
            >
              ABDM Registration
            </button>
          </div>
          <div>
            <button
              className={selectedButton === "consentList" ? "active" : ""}
              onClick={() => handleButtonClick("consentList")}
            >
              Consent List
            </button>
          </div>
          <div>
            <button
              className={selectedButton === "appointment" ? "active" : ""}
              onClick={() => handleButtonClick("appointment")}
            >
              Appointments
            </button>
          </div>
          <div>
            <button
              className={selectedButton === "documents" ? "active" : ""}
              onClick={() => handleButtonClick("documents")}
            >
              View Documents
            </button>
          </div>
          <div>
            <button
              className={selectedButton === "addVisit" ? "active" : ""}
              onClick={() => handleButtonClick("addVisit")}
            >
              Add Visit
            </button>
          </div>
          <div>
            <button
              className={selectedButton === "clinic" ? "active" : ""}
              onClick={() => handleButtonClick("clinic")}
            >
              Clinic
            </button>
          </div>
        </div>
        <div className="content">
          {selectedButton === "consentList" && <ConsentList />}
          {selectedButton === "appointment" && <Appointment />}
          {selectedButton === "addVisit" && <AddVisit />}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;

