import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import Link and useNavigate
import "../Styles/login.css";
import axios from "axios";

const Login = () => {
  const [email, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // useNavigate hook

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8081/api/v1/auth/authenticate",
        { email, password }
      );

      console.log('Response from backend:', response.data);

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userRole", response.data.role);

      switch (response.data.role) {
        case "PATIENT":
          navigate("/patient-dashboard"); // Use navigate to redirect
          break;
        case "CLINIC":
          navigate("/clinic-dashboard");
          break;
        case "ADMIN":
          navigate("/admin-dashboard");
          break;
        default:
          setError("Invalid role");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setError("Invalid username or password");
    }
  };

  return (
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
              <label className="form-label">Email :</label>
              <input
                type="text"
                className="form-input"
                value={email}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password :</label>
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
                <a href="https://google.com">Forgot Password?</a>
              </div>
              <div className="newuser">
                <Link to="/selectoption">New User?</Link>
              </div>
            </div>
            <button type="submit" className="login-button">
              Sign In
            </button>
            {error && <div className="error-message">{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
