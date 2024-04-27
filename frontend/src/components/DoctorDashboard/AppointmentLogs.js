// AppointmentLogs.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../Styles/DoctorDashboard/appointmentLogs.css";
import Navbar from "../navbar";

const DeleteSlotPopup = ({ onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>Confirmation</h2>
        <p>Are you sure you want to cancel this appointment?</p>
        {/* Add Deny Consent confirmation message and buttons here */}
        <button className="close-button" onClick={onClose}>
          Yes
        </button>
        <button className="close-button" onClick={onClose}>
          No
        </button>
      </div>
    </div>
  );
};

const AppointmentLogs = () => {
  const navigate = useNavigate();

  const [showDeleteSlotPopup, setShowDeleteSlotPopup] = useState(false);

  const [logs, setSlots] = useState([
    {
      id: 1,
      patientName: "Parag",
      patientID: "P101",
      purpose: "Check-Up",
      day: "Monday",
      date: "20-05-2024",
      from: "09:00AM",
      to: "09:30AM",
    },
    {
      id: 2,
      patientName: "Vicky",
      patientID: "P105",
      purpose: "Check-Up",
      day: "Tuesday",
      date: "21-05-2024",
      from: "09:00AM",
      to: "09:30AM",
    },
  ]);

  return (
    <div className="appointment-logs-container">
      <div className="logs-list">
        {logs.map((log) => (
          <div key={log.id} className="logs-item">
            <div className="image">
              <img src="logo192.png" className="image" alt="Profile Pic" />
            </div>
            <div className="logs-info">
              <div className="patient-info">
                <p>
                  <strong>
                    {log.patientName} ({log.patientID})
                  </strong>{" "}
                  &emsp; Has booked an appointment.
                </p>
              </div>
              <div className="purpose">
                <p>
                  <strong>Purpose of Appointment : &emsp;</strong> {log.purpose}
                </p>
              </div>
              <div className="logs-date-time">
                <p>Date : &emsp;{log.date}</p>
                <p>Day : &emsp;{log.day}</p>
              </div>
              <p>
                Time : &emsp;From {log.from} &emsp;&emsp;To {log.to}
              </p>
            </div>

            <div className="cancel-buttons">
              <div className="cancel-slot">
                <button onClick={() => setShowDeleteSlotPopup(true)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* <div className="add-slots">
                <button className="add-btn">Add Slots</button>
            </div> */}

      {showDeleteSlotPopup && (
        <DeleteSlotPopup onClose={() => setShowDeleteSlotPopup(false)} />
      )}
    </div>
  );
};

export default AppointmentLogs;
