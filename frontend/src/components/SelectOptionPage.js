// SelectOptionPage.js

import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../Styles/selectOptionPage.css"; // Import the CSS file

import { useNavigate } from "react-router-dom";

const SelectOptionPage = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const navigate = useNavigate();

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    navigate(`/RegisterPage/${option}`);
  };

  // const SelectOptionPage = () => {
  //   const [selectedOption, setSelectedOption] = useState("");

  //   const handleOptionSelect = (option) => {
  //     setSelectedOption(option);
  //   };

  //   const options = ["Patient", "Clinic"];

  return (
    <div className="option-container">
      <div className="divisions">
        <div className="description">
          <img src="/hadlogo.png" alt="logo"></img>
          <h1>Register As </h1>
          <h3>Create your Dhanvantari account</h3>
        </div>
        <div className="options">
          <div className="buttons">
            <button className="option-button" onClick={() => handleOptionSelect("PATIENT")}>Patient</button>
          </div>
          <div className="buttons">
            <button className="option-button" onClick={() => handleOptionSelect("CLINIC")}>Clinic</button>
          </div>
        </div>
      </div>
    </div>

    // <div className="option-container">
    //   <h1 className="option-heading">Register as a:</h1>
    //   <button className="option-button" onClick={() => handleOptionSelect('Patient')}>Patient</button>
    //   <button className="option-button" onClick={() => handleOptionSelect('Clinic')}>Clinic</button>
    //   <Link to={`/register/${selectedOption}`}>
    //     <button className="register-button" disabled={!selectedOption}>Register</button>
    //   </Link>
    // </div>
  );
};

export default SelectOptionPage;
