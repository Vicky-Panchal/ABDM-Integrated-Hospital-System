import React, { useEffect, useState } from "react";
import "../Styles/abdmRegistration.css";
import axios from "axios";

function PDFViewer({ pdfData }) {
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    if (pdfData) {
      // Convert bytes data to a Blob object
      const blob = new Blob([pdfData], { type: 'application/pdf' });
      // Create URL for the Blob object
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    }
  }, [pdfData]);

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      {pdfUrl ? (
        <iframe src={pdfUrl} title="PDF Viewer" style={{ width: '100%', height: '100%' }} />
      ) : (
        <div>Loading PDF...</div>
      )}
    </div>
  );
}

const ABDMRegistration = () => {
  const [aadharNumber, setAadharNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [txnId, setTxnId] = useState("");
  const [otpFieldDisabled, setOtpFieldDisabled] = useState(true);
  const [pdfUrl, setPdfUrl] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [currentSlide, setCurrentSlide] = useState(1);
  const [pdfData, setPdfData] = useState(null);
  

  const handleSendOTPClick = () => {
    setOtpFieldDisabled(false);
  };
  
  const handleNext = () => {
    setCurrentSlide(currentSlide + 1);
  };

  const handlePrevious = () => {
    setCurrentSlide(currentSlide - 1);
  };

  const handleAadharSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = JSON.parse(window.localStorage.getItem("loggedInUser")).access_token;
      const response = await axios.post(
        "http://localhost:8081/api/v1/patient/generateOtp",
        { aadhaar: aadharNumber },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;
      setTxnId(data.txnId);
      setOtpFieldDisabled(false);
      handleNext(); // Move to the next slide after successful OTP generation
    } catch (error) {
      console.error("Error sending Aadhaar number:", error);
      if (error.response) {
        console.error("Server response:", error.response.data);
      }
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      const token = JSON.parse(window.localStorage.getItem("loggedInUser")).access_token;
      const response = await axios.post(
        "http://localhost:8081/api/v1/patient/verifyOtp",
        { txnId, otp },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      // If OTP is verified successfully, move to the next slide
      handleNext();
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setVerificationError("Incorrect OTP. Please try again.");
    }
  };

  const handlePhoneSubmit = async (e) => {
    
    e.preventDefault();
    try {
      const token = JSON.parse(window.localStorage.getItem("loggedInUser")).access_token;
      const response = await axios.post(
        "http://localhost:8081/api/v1/patient/checkAndGenerateMobileOTP",
        {
          txnId,
          "mobile":phoneNumber,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;
      console.log(data);
      if (true) {
        const consentData = {
          consent: true,
          consentVersion: "v1.0",
          txnId,
        };
        const consentResponse = await axios.post(
          "http://localhost:8081/api/v1/patient/createHealthIdByAdhaar",
          consentData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const consentToken = consentResponse.data.token;

        
        const pdfResponse = await axios.get("http://localhost:8081/api/v1/patient/getCard", {
          params: {
            token: consentToken,
          },
        
            headers: {
              
              Authorization: `Bearer ${token}`
            },
          
          responseType: 'arraybuffer' // Set response type to arraybuffer to get binary data
        });

        console.log(pdfResponse);
        const blob = new Blob([pdfResponse.data], { type: 'application/pdf' });
      // Create URL for the Blob object
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
        setCurrentSlide(4); // Move to the slide to display the PDF
      } else {
        setVerificationError("Mobile number not verified. Please enter a verified mobile number.");
      }
    } catch (error) {
      console.error("Error verifying mobile number:", error);
      if (error.response) {
        console.error("Server response:", error.response.data);
      }
    }
  };

  return (
    <div className="abdmRegistration-container">
      <div className={`slide ${currentSlide === 1 ? "active" : ""}`}>
        <div className="divisions">
          <div className="description">
            <img src="/hadlogo.png" alt="logo" />
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
                <div className="verify"><button type="submit" onClick={handleSendOTPClick}>Send OTP</button></div>
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
            <img src="/hadlogo.png" alt="logo" />
            <h1>ABDM User</h1>
            <h3>Provide OTP</h3>
          </div>
          <div className="form">
            <form onSubmit={handleVerifyOTP}>
            <div className="form-group">
                <label className="form-label">OTP :</label>
                <input
                  type="text"
                  className="form-input"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required={!otpFieldDisabled}
                  disabled={otpFieldDisabled}
                />
              </div>
              <div className="buttons">
                <button type="button" className="button" onClick={handlePrevious}>
                  Previous
                </button>
                <button type="submit" className="button">
                  Submit
                </button>
              </div>
              {verificationError && <div className="error-message">{verificationError}</div>}
            </form>
          </div>
        </div>
      </div>

      <div className={`slide ${currentSlide === 3 ? "active" : ""}`}>
        <div className="divisions">
          <div className="description">
            <img src="/hadlogo.png" alt="logo" />
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
              </div>
              <div className="buttons">
                <button type="button" className="button" onClick={handlePrevious}>
                  Previous
                </button>
                <button type="submit" className="button">
                  Submit
                </button>
              </div>
              {verificationError && <div className="error-message">{verificationError}</div>}
            </form>
          </div>
        </div>
      </div>

      <div className={`slide ${currentSlide === 4 ? "active" : ""}`}>
        <div className="pdf-display">
          {pdfUrl ? (
            <iframe src={pdfUrl} title="PDF Document" width="100%" height="500px"></iframe>
          ) : (
            <p>No PDF available</p>
          )}
          {pdfUrl && (
            <div className="pdf-actions">
              <a href={pdfUrl} download="document.pdf">
                Download PDF
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ABDMRegistration;
