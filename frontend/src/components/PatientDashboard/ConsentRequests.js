// ConsentRequests.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../Styles/PatientDashboard/consentRequests.css";
import Navbar from "../navbar";

const GrantConsentPopup = ({ onClose }) => {
    const [pin, setPin] = useState("");
    return (
      <div className="popup-overlay">
        <div className="popup">
          <h2>Enter Consent PIN</h2>
          {/* Add OTP input field and submit button here */}
          <div className="inp"><input type="password" 
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          maxLength={4} // Restrict input to 4 characters
          placeholder="* * * *" // Display transparent stars as placeholder 
          /></div>
          <div>
          <button className="close-button" onClick={onClose}>Submit</button>
          <button className="close-button" onClick={onClose}>Close</button>
        </div>
        </div>
      </div>
    );
  };
  
  const DenyConsentPopup = ({ onClose }) => {
    return (
      <div className="popup-overlay">
        <div className="popup">
          <h2>Confirmation</h2>
          <p>Are you sure you want to deny consent?</p>
          {/* Add Deny Consent confirmation message and buttons here */}
          <button className="close-button" onClick={onClose}>Yes</button>
          <button className="close-button" onClick={onClose}>No</button>
        </div>
      </div>
    );
  };

const ConsentRequests = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      doctorName: "Johny Sins",
      doctorId: "DOC123",
      purposeOfRequest: "Consultation",
      dateTime: "2024-02-25T10:30:00Z",
    },
    {
      id: 2,
      doctorName: "Raj Pal Yadav",
      doctorId: "DOC456",
      purposeOfRequest: "Lab Test",
      dateTime: "2024-02-25T11:45:00Z",
    },
    {
      id: 3,
      doctorName: "Johny Sins",
      doctorId: "DOC789",
      purposeOfRequest: "Prescription",
      dateTime: "2024-02-25T13:15:00Z",
    },
  ]);

  const [showGrantConsentPopup, setShowGrantConsentPopup] = useState(false);
  const [showDenyConsentPopup, setShowDenyConsentPopup] = useState(false);

  const navigate = useNavigate();

  const handleGrantConsent = () => {
    // Logic to handle grant consent action
    // Remove the corresponding notification from the list
  };

  const handleDenyConsent = () => {
    // Logic to handle deny consent action
    // Remove the corresponding notification from the list
  };

  return (
    <div>
      <Navbar />
      <div className="requests-container">
        <h2>Consent Requests</h2>
        <div className="notification-list">
          {notifications.map((notification) => (
            <div key={notification.id} className="notification-item">
              <div className="notification-info">
                <p>
                  <strong>
                    {notification.doctorName} ({notification.doctorId})
                  </strong>{" "}
                </p>
                <p>Wants to access your records.</p>
                <p>
                  <strong>Purpose of Request :</strong>{" "}
                  {notification.purposeOfRequest}
                </p>
                <p className="date-time">{new Date(notification.dateTime).toLocaleString()}</p>
              </div>
              <div className="consent-buttons">
                <div className="grant">
                  <button onClick={() => setShowGrantConsentPopup(true)}>Grant Consent</button>
                </div>
                <div className="deny">
                  <button onClick={() => setShowDenyConsentPopup(true)}>Deny Consent</button>
                </div>
                <div className="view-more">
                  <p onClick={() => {navigate("/ConsentInfo");}}>View More</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {showGrantConsentPopup && <GrantConsentPopup onClose={() => setShowGrantConsentPopup(false)} />}
      {showDenyConsentPopup && <DenyConsentPopup onClose={() => setShowDenyConsentPopup(false)} />}
    </div>
  );
};

export default ConsentRequests;
