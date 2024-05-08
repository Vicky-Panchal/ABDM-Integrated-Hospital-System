import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../../Styles/PatientDashboard/consentInfo.css";
import axios from "axios";

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

const ConsentInfo = () => {
  const location = useLocation();
  const [info, setInfo] = useState(null);
  const [showGrantConsentPopup, setShowGrantConsentPopup] = useState(false);
  const [showDenyConsentPopup, setShowDenyConsentPopup] = useState(false);

  useEffect(() => {
    const consentData = location.state?.notification;
    console.log(consentData);
    if (consentData) {
      setInfo(consentData);
    }
  }, [location]);

  const handleGrantConsent = async () => {
    try {
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      const token = loggedInUser.access_token;
      await axios.post(
        "http://localhost:8081/api/v1/consent/changeConsentStatus",
        {
          consentRequestId: info.consentRequestId,
          consentStatus: "GRANTED",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Optionally, you can handle success response here
    } catch (error) {
      console.error("Error granting consent:", error);
    }
  };

  const handleDenyConsent = async () => {
    try {
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      const token = loggedInUser.access_token;
      await axios.post(
        "http://localhost:8081/api/v1/consent/changeConsentStatus",
        {
          consentRequestId: info.consentRequestId,
          consentStatus: "REQUESTED",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Optionally, you can handle success response here
    } catch (error) {
      console.error("Error denying consent:", error);
    }
  };

  const renderHealthType = () => {
    // Function remains the same
  };

  return (
    <div className="request-container">
      <div className="head">
        <div className="heading">
          <h2>Consent Information</h2>
        </div>
      </div>
      <hr />
      {
        info && (
          <div className="form-container">
            <div className="form-info-grid">
              {/* Rendering form information */}
            </div>
            {info.status === "REQUESTED" && (
              <div className="form-submit">
                <div className="grant">
                  <button onClick={handleGrantConsent}>Grant Consent</button>
                </div>
                <div className="deny">
                  <button onClick={handleDenyConsent}>Deny Consent</button>
                </div>
              </div>
            )}

            {info.status === "GRANTED" && (
              <div className="form-submit">
                <div className="deny">
                  <button onClick={handleDenyConsent}>Revoke</button>
                </div>
              </div>
            )}

          </div>
        )
      }
      
      {showGrantConsentPopup && (
        <GrantConsentPopup onClose={() => setShowGrantConsentPopup(false)} />
      )}
      {showDenyConsentPopup && (
        <DenyConsentPopup onClose={() => setShowDenyConsentPopup(false)} />
      )}
    </div>
  );
};

export default ConsentInfo;
