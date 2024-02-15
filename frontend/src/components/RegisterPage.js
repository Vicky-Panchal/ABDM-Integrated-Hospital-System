import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

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
    <div>
      <h1>Register as a {option}</h1>
      <form onSubmit={handleRegister}>
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleFormChange} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleFormChange} required />
        </div>
        <Link to="/dashboard"><button type="submit">Register</button></Link>
      </form>
    </div>
  );
};

export default RegisterPage;
