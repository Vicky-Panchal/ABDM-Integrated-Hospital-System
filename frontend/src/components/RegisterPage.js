// RegisterPage.js

import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../Styles/registerPage.css'; // Import the CSS file

const RegisterPage = () => {
  const { option } = useParams();
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = () => {
    // You can add your registration logic here
    // For demonstration, we'll just log the form data
    console.log(formData);
  };

  return (
    <div className="register-container">
      <h1 className="register-heading">Register as a {option}</h1>
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label className="form-label">Name:</label>
          <input type="text" name="name" className="form-input" value={formData.name} onChange={handleFormChange} required />
        </div>
        <div className="form-group">
          <label className="form-label">Email:</label>
          <input type="email" name="email" className="form-input" value={formData.email} onChange={handleFormChange} required />
        </div>
        <Link to="/dashboard"><button type="submit" className="register-button">Register</button></Link>
      </form>
    </div>
  );
};

export default RegisterPage;
