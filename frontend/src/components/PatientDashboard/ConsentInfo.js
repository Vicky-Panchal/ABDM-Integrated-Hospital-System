// ConsentInfo.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../Styles/PatientDashboard/consentInfo.css";
// import Navbar from "../navbar";

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

const ConsentInfo = () => {
  const navigate = useNavigate();

  const [dummy_info, setdummy_info] = [
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
        "Diagnostics"
      ],
      status: "REQUESTED"
    }
  ];

  const [info, setInfo] = useState([]);
  const [healthType, setHealthType] = useState([]);
  const [showGrantConsentPopup, setShowGrantConsentPopup] = useState(false);
  const [showDenyConsentPopup, setShowDenyConsentPopup] = useState(false);

  // useEffect hook to set dummy data when the component mounts
  useEffect(() => {
    setInfo(dummy_info);
    setHealthType(dummy_info.hiTypes);
  }, []);

  const renderHealthType = () => {
    const rows = [];
    for (let i = 0; i < healthType.length; i += 2) {
      rows.push(
        <div className="healthType-container">
          <div className="healthType-row" key={i}>
            <div className="healthType-item1">
              <label>{healthType[i]}</label>
            </div>
            {i + 1 < healthType.length && (
              <div className="healthType-item2">
                <label>{healthType[i + 1]}</label>
              </div>
            )}
          </div>
        </div>
      );
    }
    return rows;
  };

  return (
    <div className="request-container">
      <div className="head">
        <div className="heading">
          <h2>Consent Information</h2>
        </div>
      </div>
      <hr />
      <div className="form-container">
        <div className="form-info-grid">
          <div className="grid-item">
            <div className="title">
              <label>Doctor Name : </label>
            </div>
          </div>
          <div className="grid-item">
            <div className="fields">
              <label>{info.doctorName}</label>
            </div>
          </div>

          <div className="grid-item">
            <div className="title">
              <label>Purpose of Request : </label>
            </div>
          </div>
          <div className="grid-item">
            <div className="fields">
              <label>{info.purpose}</label>
            </div>
          </div>

          <div className="grid-item">
            <div className="title">
              <label>Health Information From : </label>
            </div>
          </div>
          <div className="grid-item">
            <div className="fields">
              <label>{info.dateFrom}</label>
            </div>
          </div>

          <div className="grid-item">
            <div className="title">
              <label>Health Information To : </label>
            </div>
          </div>
          <div className="grid-item">
            <div className="fields">
              <label>{info.dateTo}</label>
            </div>
          </div>

          <div className="grid-item">
            <div className="title">
              <label>Health Information Type : </label>
            </div>
          </div>
          <div className="grid-item">
            <div className="fields">{renderHealthType()}</div>
          </div>

          <div className="grid-item">
            <div className="title">
              <label>Consent Expiry : </label>
            </div>
          </div>
          <div className="grid-item">
            <div className="fields">
              <label>{info.dateEraseAt}</label>
            </div>
          </div>

          <div className="grid-item">
            <div className="title">
              <label>Status : </label>
            </div>
          </div>
          <div className="grid-item">
            <div className="fields">
              <label>{info.status}</label>
            </div>
          </div>
        </div>

        {info.status === "REQUESTED" && (
        <div className="form-submit">
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
        </div>
        )}

        {info.status === "GRANTED" && (
        <div className="form-submit">
          <div className="deny">
            <button onClick={() => setShowDenyConsentPopup(true)}>
              Revoke
            </button>
          </div>
        </div>
        )}

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

export default ConsentInfo;
