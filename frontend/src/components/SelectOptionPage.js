// SelectOptionPage.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/selectOptionPage.css'; // Import the CSS file

const SelectOptionPage = () => {
  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className="option-container">
      <h1 className="option-heading">Register as a:</h1>
      <button className="option-button" onClick={() => handleOptionSelect('Patient')}>Patient</button>
      <button className="option-button" onClick={() => handleOptionSelect('Clinic')}>Clinic</button>
      <Link to={`/register/${selectedOption}`}>
        <button className="register-button" disabled={!selectedOption}>Register</button>
      </Link>
    </div>
  );
};

export default SelectOptionPage;
