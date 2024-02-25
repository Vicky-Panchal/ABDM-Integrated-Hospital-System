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
          <img src="/hadlogo.png" alt="logo"></img>
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
