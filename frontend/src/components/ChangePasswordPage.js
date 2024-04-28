import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./navbar";

const ChangePasswordPage = () => {
  const [currentPassword, setcurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmationPassword, setConfirmPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const userId = JSON.parse(localStorage.getItem("loggedInUser")).user_id;
  const token = JSON.parse(localStorage.getItem("loggedInUser")).access_token;
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
    return regex.test(password);
  };

  const handleChangePassword = async () => {
    // Validate new password
    if (!validatePassword(newPassword)) {
        setNewPasswordError(
          "Password must be more than 8 characters and contain both numbers and letters/special characters"
        );
        return;
      } else {
        setNewPasswordError("");
      }
  
      // Validate confirm password
      if (newPassword !== confirmationPassword) {
        setConfirmPasswordError("Passwords do not match.");
        return;
      } else {
        setConfirmPasswordError("");
      }

    try {
      const response = await axios.patch(
        "http://localhost:8081/api/v1/users/changePassword",
        {
          userId: userId,
          currentPassword: currentPassword,
          newPassword: newPassword,
          confirmationPassword: confirmationPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("Password changed successfully.");
        // Redirect to profile page or show a success message
        navigate("/ProfilePage");
    } else {
        console.error("Failed to change password.");
        // Show error message
      }
    } catch (error) {
      console.error("Error changing password:", error);
      // Show error message

    }
  };

  return (
    <div>
      <Navbar />
      <div className="change-password-container">
        <h2>Change Password</h2>
        <div className="form-group">
          <label htmlFor="oldPassword">Old Password:</label>
          <input
            type="password"
            id="oldPassword"
            value={currentPassword}
            onChange={(e) => setcurrentPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="newPassword">New Password:</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          {newPasswordError && <div className="error">{newPasswordError}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmationPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {confirmPasswordError && (
            <div className="error">{confirmPasswordError}</div>
          )}

        </div>
        <button onClick={handleChangePassword}>Submit</button>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
