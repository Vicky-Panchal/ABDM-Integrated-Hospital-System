import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../navbar";
import "../../Styles/DoctorDashboard/addVisit.css";

const AddVisit = () => {
  const [patients, setPatients] = useState([]);
  const [patient, setPatient] = useState("");
  const [otp, setOtp] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [prescription, setPrescription] = useState("");
  const [dosage, setDosage] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [otpEnabled, setOtpEnabled] = useState(false);
  const [formEnabled, setFormEnabled] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [accessToken, setAccessToken] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        const token = loggedInUser.access_token;
        const response = await axios.get(
          "http://localhost:8081/api/v1/patient/getAllPatients",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPatients(response.data);
        setAccessToken(token);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };
    fetchPatients();
  }, []);

  const handlePrescriptionChange = (e) => {
    setPrescription(e.target.value);
  };

  const handleDiagnosisChange = (e) => {
    setDiagnosis(e.target.value);
  };

  const handleDosageChange = (e) => {
    setDosage(e.target.value);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSendOTP = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/v1/patient/verifyAbhaUsingMobile?patient_id=${patient}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setTransactionId(response.data.transactionId);
      setOtpEnabled(true);
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      await axios.get(
        `http://localhost:8081/api/v1/patient/confirm-otp?transactionId=${transactionId}&otp=${otp}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setFormEnabled(true);
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("patientId", patient);
      formData.append("patientAuthToken", accessToken);
      formData.append("diagnosis", diagnosis);
      formData.append("dosageInstruction", dosage);
      formData.append("prescription", prescription);
      formData.append("healthRecord", selectedFile);

      await axios.post(
        "http://localhost:8081/api/v1/visit/add-visit",
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // Reset form fields
      setPatient("");
      setPrescription("");
      setDosage("");
      setDiagnosis("");
      setSelectedFile(null);
      setOtp("");
      setTransactionId("");
      setOtpEnabled(false);
      setFormEnabled(false);
      // Redirect or show success message
      // navigate("/success"); // Redirect to success page
      alert("Visit details added successfully!");
    } catch (error) {
      console.error("Error adding visit details:", error);
    }
  };

  return (
    <div className="add-visit-container">
      <div className="visit-heading">
        <h2>Add Patient Visit Details</h2>
      </div>
      <hr />
      <div className="patient-specific">
        <label>Select Patient : </label>
        <select
          className="dropdown-select"
          value={patient}
          onChange={(e) => setPatient(e.target.value)}
        >
          <option value="">Select Patient</option>
          {patients.map((patient) => (
            <option key={patient.patientId} value={patient.patientId}>
              {`${patient.firstName} ${patient.lastName}`}
            </option>
          ))}
        </select>
        <button onClick={handleSendOTP}>Send OTP</button>
      </div>
      {otpEnabled && (
        <div className="otp-specific">
          <label>Enter OTP : </label>
          <input
            className="OTP"
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button onClick={handleVerifyOTP}>Verify OTP</button>
        </div>
      )}
      {formEnabled && (
        <div className="form-specific">
          <form onSubmit={handleFileSubmit}>
            <div className="visit-form-grid">
              <div className="visit-grid-item">
                <label>Prescription : </label>
              </div>
              <div className="visit-grid-item">
                <textarea
                  value={prescription}
                  onChange={handlePrescriptionChange}
                  rows={3}
                  cols={50}
                ></textarea>
              </div>
              <div className="visit-grid-item">
                <label>Dosage Instruction : </label>
              </div>
              <div className="visit-grid-item">
                <textarea
                  value={dosage}
                  onChange={handleDosageChange}
                  rows={3}
                  cols={50}
                ></textarea>
              </div>
              <div className="visit-grid-item">
                <label>Diagnosis : </label>
              </div>
              <div className="visit-grid-item">
                <textarea
                  value={diagnosis}
                  onChange={handleDiagnosisChange}
                  rows={3}
                  cols={50}
                ></textarea>
              </div>
              <div className="visit-grid-item">
                <label htmlFor="fileInput">Upload Document : </label>
              </div>
              <div className="visit-grid-item">
                <input
                  type="file"
                  id="fileInput"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileChange}
                />
              </div>
            </div>
            <div className="submit-form-button">
              <button type="submit">Upload</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddVisit;
