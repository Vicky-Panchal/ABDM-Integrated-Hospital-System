import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../Styles/PatientDashboard/consentRequests.css";
import Navbar from "../navbar";
import axios from "axios";
import ConsentInfo from "./ConsentInfo";

const GrantConsentPopup = ({ onClose }) => {
  const [pin, setPin] = useState("");
  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>Enter Consent PIN</h2>
        <div className="inp">
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            maxLength={4}
            placeholder="* * * *"
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
  const [notifications, setNotifications] = useState([]);
  const fetchConsentInfo = async () => {
    try {
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      const token = loggedInUser.access_token;
      const response = await axios.get(
        "http://localhost:8081/api/v1/consent/getConsentRequestsPatient",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.data;
      console.log(data);
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching consent information:", error);
    }
  };

  useEffect(() => {
    fetchConsentInfo();
  }, []);

  const [showGrantConsentPopup, setShowGrantConsentPopup] = useState(false);
  const [showDenyConsentPopup, setShowDenyConsentPopup] = useState(false);

  const navigate = useNavigate();

  const handleGrantConsent = async (consentRequestId) => {
    try {
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      const token = loggedInUser.access_token;
      await axios.post(
        "http://localhost:8081/api/v1/consent/changeConsentStatus",
        {
          consentRequestId,
          consentStatus: "GRANTED",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Refresh the consent requests after granting consent
      fetchConsentInfo();
    } catch (error) {
      console.error("Error granting consent:", error);
    }
  };

  const handleDenyConsent = async (consentRequestId) => {
    try {
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      const token = loggedInUser.access_token;
      await axios.post(
        "http://localhost:8081/api/v1/consent/changeConsentStatus",
        {
          consentRequestId,
          consentStatus: "REVOKED",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Refresh the consent requests after denying consent
      fetchConsentInfo();
    } catch (error) {
      console.error("Error denying consent:", error);
    }
  };

  const handleViewMore = (notification) => {
    console.log(notification);
    navigate("/ConsentInfo", { state: { notification } });
  };

  const getTimeAgo = (creationTime) => {
    // Function remains the same
  };

  return (
    <div className="requests-container">
      <h2>Consent Requests</h2>
      <div className="notification-list">
        {notifications.map((notification) => (
          <div
            key={notification.consentRequestId}
            className="notification-item"
          >
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
              <p className="date-time">{getTimeAgo(notification.createdAt)}</p>
            </div>
            {notification.status === "REQUESTED" && (
              <div className="consent-buttons">
                <div className="grant">
                  <button onClick={() => handleGrantConsent(notification.consentRequestId)}>
                    Grant Consent
                  </button>
                </div>
                <div className="deny">
                  <button onClick={() => handleDenyConsent(notification.consentRequestId)}>
                    Deny Consent
                  </button>
                </div>
                <div className="view-more">
                  <p onClick={() => handleViewMore(notification)}>View More</p>
                </div>
              </div>
            )}
            {notification.status === "GRANTED" && (
              <div className="consent-buttons">
                <div className="deny">
                  <button onClick={() => handleDenyConsent(notification.consentRequestId)}>
                    Revoke Consent
                  </button>
                </div>
                <div className="view-more">
                  <p onClick={() => handleViewMore(notification)}>View More</p>
                </div>
              </div>
            )}
            {notification.status === "REVOKED" && (
              <div className="consent-buttons">
                <div className="view-more">
                  <p onClick={() => handleViewMore(notification)}>View More</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {showDenyConsentPopup && (
        <DenyConsentPopup onClose={() => setShowDenyConsentPopup(false)} />
      )}
    </div>
  );
};

export default ConsentRequests;
