import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../Styles/DoctorDashboard/addVisit.css";
import Navbar from "../navbar";

const AddVisit = () => {
  const dummyPatients = [
    {
      id: 1,
      name: "Parag Dutt Sharma",
    },
    {
      id: 2,
      name: "Swarnim Kukreti",
    },
    {
      id: 3,
      name: "Adarsh Tripathi",
    },
  ];

  const [patient, setPatient] = useState("");
  const [otp, setotp] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [prescription, setPrescription] = useState("");
  const [dosage, setDosage] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [otpEnabled, setOtpEnabled] = useState(false);
  const [formEnabled, setFormEnabled] = useState(false);

  const handlePrescriptionChange = (e) => {
    setPrescription(e.target.value);
  };

  const handleDiagnosisChange = (e) => {
    setDiagnosis(e.target.value);
  };

  const handleDosageChange = (e) => {
    setDosage(e.target.value);
  };

  // Function to handle file selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Function to handle form submission
  const handleFileSubmit = (e) => {
    e.preventDefault();
    if (selectedFile) {
      // Perform upload operation here, e.g., send file to server
      console.log("Selected file:", selectedFile);
      // Reset the selected file state after upload
      setSelectedFile(null);
    } else {
      alert("Please select a file to upload");
    }
  };

  const handleSendOTP = () => {
    // Enable OTP-specific section
    setOtpEnabled(true);
  };

  const handleVerifyOTP = () => {
    // Enable form-specific section
    setFormEnabled(true);
  };

  return (
    <div className="add-visit-container">
      <div className="visit-heading">
        <h2>Add Patient Visit Details</h2>
      </div>
      <hr />
      <div className="patient-specific">
        <label>Select Patient : </label>
        <select className="dropdown-select" value={patient} onChange={(e) => setPatient(e.target.value)}>
          {dummyPatients.map((item) => (
            <option id={item.id} value={item.name}>
              {item.name}
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
            onChange={(e) => setotp(e.target.value)}
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
                  id="prescriptionInput"
                  value={prescription}
                  onChange={handlePrescriptionChange}
                  rows={3} // Adjust the number of rows as needed
                  cols={50} // Adjust the number of columns as needed
                ></textarea>
              </div>

              <div className="visit-grid-item">
                <label>Dosage Instruction : </label>
              </div>

              <div className="visit-grid-item">
                <textarea
                  id="DosageInput"
                  value={dosage}
                  onChange={handleDosageChange}
                  rows={3} // Adjust the number of rows as needed
                  cols={50} // Adjust the number of columns as needed
                ></textarea>
              </div>

              <div className="visit-grid-item">
                <div>
                  <label>Diagnosis : </label>
                </div>
              </div>

              <div className="visit-grid-item">
                <textarea
                  id="DiagnosisInput"
                  value={diagnosis}
                  onChange={handleDiagnosisChange}
                  rows={3} // Adjust the number of rows as needed
                  cols={50} // Adjust the number of columns as needed
                ></textarea>
              </div>

              <div className="visit-grid-item">
                <label htmlFor="fileInput">Upload Document : </label>
              </div>
              <div className="visit-grid-item">
                <input
                  type="file"
                  id="fileInput"
                  accept=".pdf,.doc,.docx,.txt" // Specify accepted file types
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
