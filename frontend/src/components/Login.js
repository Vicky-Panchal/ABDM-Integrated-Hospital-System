import React, { useState } from "react";

import "../Styles/login.css"; // Import the CSS file
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8081/api/v1/auth/authenticate",
        { username, password }
      );
      if (response.data.success) {
        // Store user login info in localStorage
        localStorage.setItem("isLoggedIn", true);
        // Redirect to dashboard upon successful login
        window.location.href = "/dashboard";
      } else {
        setError("Invalid username or password");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setError("An unexpected error occurred");
    }
  };

  const handleRegister = () => {
    // Redirect to registration page
    window.location.href = "/selectoption";
  };

  return (
    // <div className="login-container">
    //   <h2 className="login-heading">Login</h2>
    //   <form onSubmit={handleLogin}>
    //     <div className="form-group">
    //       <label className="form-label">Username:</label>
    //       <input type="text" className="form-input" value={username} onChange={(e) => setUsername(e.target.value)} required />
    //     </div>
    //     <div className="form-group">
    //       <label className="form-label">Password:</label>
    //       <input type="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
    //     </div>
    //     <button type="submit" className="login-button">Login</button>
    //     {error && <div className="error-message">{error}</div>}
    //   </form>
    //   <div className="new-user-option">
    //     <p>New User? <button onClick={handleRegister} className="register-button">Register</button></p>
    //   </div>
    // </div>

    <div className="login-container">
      <div className="divisions">
        <div className="description">
          <img src="data:image/png;base64,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"></img>
          <h1>Log In</h1>
          <h3>Use your Dhanvantari account</h3>
        </div>
        <div className="form">
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Username:</label>
              <input
                type="text"
                className="form-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password:</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="links">
              <div className="forgotpass">
                <a href="google.com">Forgot Password?</a>
              </div>
              <div className="newuser">
                <a href="/selectoption">New User?</a>
              </div>
            </div>
            <button type="submit" className="login-button">Sign In</button>
            {error && <div className="error-message">{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
