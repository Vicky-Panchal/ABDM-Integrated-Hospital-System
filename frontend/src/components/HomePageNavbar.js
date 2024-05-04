// HomePageNavbar.js

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/homePageNavbar.css";

const HomePageNavbar = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/Login");
  };

  const handleSignUp = () => {
    navigate("/SelectOptionPage");
  };

  return (
    <div className="home-navbar-container">
      <div className="home-divisions">
        <div className="home-left">
          <img src="/hadlogo.png" alt="logo"></img>
        </div>

        <div className="home-right">
            <button className="home-icon-login" onClick={handleLogin}>
                Login
            </button>
            <button className="home-icon-signup" onClick={handleSignUp}>
                Sign Up
            </button>
        </div>
      </div>
    </div>
  );
};

export default HomePageNavbar;
