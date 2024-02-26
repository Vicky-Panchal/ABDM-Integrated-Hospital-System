// SlideForm.js

import React, { useState } from "react";
import "../Styles/abdmRegistration.css";
import { Link, useNavigate } from "react-router-dom";

const ABDMRegistration = () => {
  const [aadharNumber, setAadharNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [currentSlide, setCurrentSlide] = useState(1);

  const handleNext = () => {
    setCurrentSlide(currentSlide + 1);
  };

  const handlePrevious = () => {
    setCurrentSlide(currentSlide - 1);
  };

  const handleAadharSubmit = (e) => {
    e.preventDefault();
    // Add Aadhar number validation logic and OTP verification here
    // For simplicity, just transition to the next slide
    setCurrentSlide(2);
  };

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    // Add phone number submission logic here
    console.log("Phone number submitted:", phoneNumber);
    // You can perform additional actions here like sending data to a server
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
                <div className="verify"><label>Send OTP</label></div>
              </div>
              <div className="form-group">
                <label className="form-label">OTP :</label>
                <input
                  type="text"
                  className="form-input"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
              <div className="buttons">
                <button type="submit" className="button" onClick={handleNext}>
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
            <form onSubmit={handleAadharSubmit}>
              <div className="form-group">
                <label className="form-label">Mobile Number :</label>
                <input
                  type="text"
                  className="form-input"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
                {/* <div className="verify"><label>Send OTP</label></div> */}
              </div>
              {/* <div className="form-group">
                <label className="form-label">OTP :</label>
                <input
                  type="text"
                  className="form-input"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div> */}
              <div className="buttons">
                <button type="submit" className="button" onClick={handlePrevious}>
                  Previous
                </button>
                <button type="submit" className="button">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    // <div className="abdm-container">
    //   <div className="slides">
    //     <div className={`slide ${currentSlide === 1 ? 'active' : ''}`}>
    //       <h2>Slide 1: Aadhar Verification</h2>
    //       <form onSubmit={handleAadharSubmit}>
    //         {/* ... Aadhar form fields ... */}
    //         <label>
    //           Aadhar Number:
    //           <input
    //             type="text"
    //             value={aadharNumber}
    //             onChange={(e) => setAadharNumber(e.target.value)}
    //             required
    //           />
    //         </label>
    //         <label>
    //           OTP:
    //           <input
    //             type="text"
    //             value={otp}
    //             onChange={(e) => setOtp(e.target.value)}
    //             required
    //           />
    //         </label>
    //         <div className="buttons">
    //           <button type="button" onClick={handleNext}>
    //             Next
    //           </button>
    //         </div>
    //       </form>
    //     </div>

    //     <div className={`slide ${currentSlide === 2 ? 'active' : ''}`}>
    //       <h2>Slide 2: Phone Number Submission</h2>
    //       <form onSubmit={handlePhoneSubmit}>
    //         {/* ... Phone number form fields ... */}
    //         <label>
    //           Phone Number:
    //           <input
    //             type="text"
    //             value={phoneNumber}
    //             onChange={(e) => setPhoneNumber(e.target.value)}
    //             required
    //           />
    //         </label>
    //         <div className="buttons">
    //           <button type="button" onClick={handlePrevious}>
    //             Previous
    //           </button>
    //           <button type="submit">Submit</button>
    //         </div>
    //       </form>
    //     </div>
    //   </div>
    // </div>
  );
};

export default ABDMRegistration;
