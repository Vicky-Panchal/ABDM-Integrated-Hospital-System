import React, { useState } from "react";
import "../Styles/abdmRegistration.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const ABDMRegistration = () => {
  const [aadharNumber, setAadharNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [txnId, setTxnId] = useState("");
  const [otpSentMessage, setOtpSentMessage] = useState("");
  const [otpFieldDisabled, setOtpFieldDisabled] = useState(true); // Initially disable OTP field
  const [currentSlide, setCurrentSlide] = useState(1);
  const navigate = useNavigate(); // Initialize navigate for programmatic navigation

  const handleNext = () => {
    setCurrentSlide(currentSlide + 1);
  };

  const handlePrevious = () => {
    setCurrentSlide(currentSlide - 1);
  };

  const handleAadharSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = JSON.parse(localStorage.getItem('loggedInUser')).access_token;
      console.log("token: " + token);
      
      const response = await axios({
        method: 'post',
        url: `http://localhost:8081/api/v1/patient/generateOtp`,
        data: aadharNumber,
        headers: {
            "Content-Type":"application/json",
            "Access-Control-Allow-Origin": "*",
            Authorization: `Bearer ${token}`,
        },
    });
      const data = response.data;
      console.log("OTP sent, txnId:", data.txnId);
      setTxnId(data.txnId);
      setOtpSentMessage(`OTP sent to ${phoneNumber.slice(-4)}`);
      // For simplicity, just transition to the next slide
      setCurrentSlide(2);
      // Enable OTP field after sending OTP
      setOtpFieldDisabled(false);
    } catch (error) {
      console.error("Error sending Aadhar number:", error);
    }
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make API call to verify OTP
      const response = await fetch("your-backend-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ txnId, otp }),
      });
      const data = await response.json();
      console.log("OTP verified:", data);
      // You can perform additional actions here based on the response
      // For example, navigate to the next page if OTP is verified successfully
      navigate("/next-page");
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  };

  return (
    <div className="abdmRegistration-container">
      <div className={`slide ${currentSlide === 1 ? "active" : ""}`}>
        <div className="divisions">
          <div className="description">
            <img src="/hadlogo.png" alt="logo"></img>
            <h1>ABDM User</h1>
            <h3>Verify your Aadhar</h3>
          </div>
          <div className="form">
            <form onSubmit={handleAadharSubmit}>
              <div className="form-group">
                <label className="form-label">Aadhar Number :</label>
                <input
                  type="text"
                  className="form-input"
                  value={aadharNumber}
                  onChange={(e) => setAadharNumber(e.target.value)}
                  required
                />
                <div className="verify"><button type="submit">Send OTP</button></div>
              </div>
              <div className="form-group">
                <label className="form-label">OTP :</label>
                <input
                  type="text"
                  className="form-input"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required={!otpFieldDisabled} // Make OTP field required only if it's enabled
                  disabled={otpFieldDisabled} // Disable OTP field initially
                />
              </div>
              <div className="buttons">
                <button type="button" className="button" onClick={handleNext}>
                  Next
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className={`slide ${currentSlide === 2 ? "active" : ""}`}>
        <div className="divisions">
          <div className="description">
            <img src="/hadlogo.png" alt="logo"></img>
            <h1>ABDM User</h1>
            <h3>Provide your Mobile Number</h3>
          </div>
          <div className="form">
            <form onSubmit={handlePhoneSubmit}>
              <div className="form-group">
                <label className="form-label">Mobile Number :</label>
                <input
                  type="text"
                  className="form-input"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
                <div className="otp-sent-message">{otpSentMessage}</div>
              </div>
              <div className="buttons">
                <button type="button" className="button" onClick={handlePrevious}>
                  Previous
                </button>
                <button type="submit" className="button">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ABDMRegistration;
