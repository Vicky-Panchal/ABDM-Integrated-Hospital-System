// Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import "../Styles/navbar.css";

const Navbar = () => {
  return (
    <div className="navbar-container">
      <div className="divisions">
        <div className="left">
          <img src="/hadlogo.png" alt="logo"></img>
        </div>
        <div className="right">
          <h6>About</h6>
          <Link to="/ProfilePage"><h6>Profile</h6></Link>
          <h6>Logout</h6>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
