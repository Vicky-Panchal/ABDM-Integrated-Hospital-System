import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../Styles/forgetPasswordPage.css";

const ForgetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [currentSlide, setCurrentSlide] = useState(1);
  const navigate = useNavigate();


  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8081/api/v1/users/forgot-password",
        { email }
      );
      setCurrentSlide(2);
    } catch (error) {
      console.error("Email Address not found", error);
      setError("Email Address not found");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8081/api/v1/users/reset-password",
        { email, otp, newPassword, confirmNewPassword }
      );
      setCurrentSlide(3);
    } catch (error) {
      console.error("Incorrect OTP", error);
      setError("Incorrect OTP");
    }
  };

  return (
    <div className="forgetPassword-container">
      <div className={`slide ${currentSlide === 1 ? "active" : ""}`}>
        <div className="divisions">
          <div className="description">
            <img src="/hadlogo.png" alt="logo" />
            <h1>Forget Password</h1>
            <h3>Enter your Email ID</h3>
          </div>
          <div className="form">
            <form onSubmit={handleEmailSubmit}>
              <div className="form-group">
                <label className="form-label">Email ID :</label>
                <input
                  type="text"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="buttons">
                <button type="submit" className="button">
                  Next
                </button>
              </div>
              {error && <div className="error-message">{error}</div>}
            </form>
          </div>
        </div>
      </div>

      <div className={`slide ${currentSlide === 2 ? "active" : ""}`}>
        <div className="divisions">
          <div className="description">
            <img src="/hadlogo.png" alt="logo" />
            <h1>Forget Password</h1>
            <h3>Enter OTP and Reset your password</h3>
          </div>
          <div className="form">
            <form onSubmit={handleResetPassword}>
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
              <div className="form-group">
                <label className="form-label">New Password :</label>
                <input
                  type="text"
                  className="form-input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password :</label>
                <input
                  type="text"
                  className="form-input"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="buttons">
                <button type="submit" className="button">
                  Submit
                </button>
              </div>
              {error && <div className="error-message">{error}</div>}
            </form>
          </div>
        </div>
      </div>

      <div className={`slide ${currentSlide === 3 ? "active" : ""}`}>
        <div className="divisions3">
          <div className="description3">
            <img src="/hadlogo.png" alt="logo" />
            <h1>Dhanvantari User</h1>
            <h3>Your password has been reset successfully.</h3>
            <div className="buttons3">
              <button
                className="button"
                onClick={() => {
                  navigate("/Login");
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    // <div>
    //     <h1>Forget Password</h1>
    //     <Slider {...settings} ref={sliderRef} initialSlide={step - 1}>
    //         <div>
    //             <form onSubmit={handleEmailSubmit}>
    //                 <label>Email:</label>
    //                 <input
    //                     type="text"
    //                     value={email}
    //                     onChange={(e) => setEmail(e.target.value)}
    //                     required
    //                 />
    //                 <button type="submit">Submit</button>
    //             </form>
    //             {error && <div>{error}</div>}
    //         </div>
    //         {step >= 2 && (
    //             <div>
    //                 <form onSubmit={handleResetPassword}>
    //                     <label>OTP:</label>
    //                     <input
    //                         type="text"
    //                         value={otp}
    //                         onChange={(e) => setOtp(e.target.value)}
    //                         required
    //                     />
    //                     <label>New Password:</label>
    //                     <input
    //                         type="password"
    //                         value={newPassword}
    //                         onChange={(e) => setNewPassword(e.target.value)}
    //                         required
    //                     />
    //                     <label>Confirm New Password:</label>
    //                     <input
    //                         type="password"
    //                         value={confirmNewPassword}
    //                         onChange={(e) => setConfirmNewPassword(e.target.value)}
    //                         required
    //                     />
    //                     <button type="submit">Submit</button>
    //                 </form>
    //                 {error && <div>{error}</div>}
    //             </div>
    //         )}
    //         {step === 3 && (
    //             <div>
    //                 <h2>Password Reset Successful</h2>
    //                 <p>Your password has been successfully reset.</p>
    //             </div>
    //         )}
    //     </Slider>
    // </div>
  );
};

export default ForgetPasswordPage;
