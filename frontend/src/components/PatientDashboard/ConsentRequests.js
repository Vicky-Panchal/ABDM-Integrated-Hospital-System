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
        <div className="inp">
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            maxLength={4} // Restrict input to 4 characters
            placeholder="* * * *" // Display transparent stars as placeholder
          />
        </div>
        <div>
          <button className="close-button" onClick={onClose}>
            Submit
          </button>
          <button className="close-button" onClick={onClose}>
            Close
          </button>
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

const ConsentRequests = () => {
  const [notifications, setNotifications] = useState([
    {
      consentRequestId: 1,
      doctorName: "Johny Sins",
      dateFrom: "05-01-2024",
      dateTo: "10-01-2024",
      dateEraseAt: "20-01-2024",
      purpose: "Consultation",
      hiTypes: [
        "OP Consultation",
        "Discharge Summary",
        "Immunization Record",
        "Wellness Record",
        "Diagnostics",
      ],
      status: "REQUESTED",
      createdAt: "2024-02-25T10:30:00Z",
    },
    {
      consentRequestId: 2,
      doctorName: "Johny Sins",
      dateFrom: "05-01-2024",
      dateTo: "10-01-2024",
      dateEraseAt: "20-01-2024",
      purpose: "Consultation",
      hiTypes: [
        "OP Consultation",
        "Discharge Summary",
        "Immunization Record",
        "Wellness Record",
        "Diagnostics",
      ],
      status: "GRANTED",
      createdAt: "2024-02-25T11:45:00Z",
    },
    {
      consentRequestId: 3,
      doctorName: "Johny Sins",
      dateFrom: "05-01-2024",
      dateTo: "10-01-2024",
      dateEraseAt: "20-01-2024",
      purpose: "Consultation",
      hiTypes: [
        "OP Consultation",
        "Discharge Summary",
        "Immunization Record",
        "Wellness Record",
        "Diagnostics",
      ],
      status: "REVOKED",
      createdAt: "2024-02-25T13:15:00Z",
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

  const handleViewMore = (consentId) => {
    navigate(`/ConsentInfo?consentId=${consentId}`);
  };

  const getTimeAgo = (creationTime) => {
    const currentTime = new Date();
    const notificationTime = new Date(creationTime);

    const timeDifference = currentTime.getTime() - notificationTime.getTime();
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(
      currentTime.getMonth() -
        notificationTime.getMonth() +
        12 * (currentTime.getFullYear() - notificationTime.getFullYear())
    );
    const years = Math.floor(
      currentTime.getFullYear() - notificationTime.getFullYear()
    );

    if (years > 0) {
      return `${years} year${years === 1 ? "" : "s"} ago`;
    } else if (months > 0) {
      return `${months} month${months === 1 ? "" : "s"} ago`;
    } else if (weeks > 0) {
      return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
    } else if (days > 0) {
      return `${days} day${days === 1 ? "" : "s"} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
    } else {
      return `${seconds} second${seconds === 1 ? "" : "s"} ago`;
    }
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
                  <strong>{notification.doctorName}</strong>{" "}
                </p>
                <p>Wants to access your records.</p>
                <p>
                  <strong>Purpose of Request :</strong> {notification.purpose}
                </p>
                <p>
                  <strong>status :</strong> {notification.status}
                </p>
                <p className="date-time">
                  {getTimeAgo(notification.createdAt)}
                </p>
              </div>
              {notification.status === "REQUESTED" && (
                <div className="consent-buttons">
                  <div className="grant">
                    <button onClick={() => setShowGrantConsentPopup(true)}>
                      Grant Consent
                    </button>
                  </div>
                  <div className="deny">
                    <button onClick={() => setShowDenyConsentPopup(true)}>
                      Deny Consent
                    </button>
                  </div>
                  <div className="view-more">
                    <p
                      onClick={() => {
                        handleViewMore(notification.consentRequestId);
                      }}
                    >
                      View More
                    </p>
                  </div>
                </div>
              )}
              {notification.status === "GRANTED" && (
                <div className="consent-buttons">
                  <div className="deny">
                    <button onClick={() => setShowDenyConsentPopup(true)}>
                      Revoke Consent
                    </button>
                  </div>
                  <div className="view-more">
                    <p
                      onClick={() => {
                        handleViewMore(notification.consentRequestId);
                      }}
                    >
                      View More
                    </p>
                  </div>
                </div>
              )}
              {notification.status === "REVOKED" && (
                <div className="consent-buttons">
                  <div className="view-more">
                    <p
                      onClick={() => {
                        handleViewMore(notification.consentRequestId);
                      }}
                    >
                      View More
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {showGrantConsentPopup && (
        <GrantConsentPopup onClose={() => setShowGrantConsentPopup(false)} />
      )}
      {showDenyConsentPopup && (
        <DenyConsentPopup onClose={() => setShowDenyConsentPopup(false)} />
      )}
    </div>
  );
};

export default ConsentRequests;
