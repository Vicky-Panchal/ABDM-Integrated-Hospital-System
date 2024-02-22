// Home.js

import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/home.css'; // Import the CSS file

const Home = () => {
  return (
    <div className="home-container">
      <h2 className="home-heading">Welcome to the Home Page</h2>
      <p className="home-text">This is a simple home page for our application.</p>
      <p className="home-text">Please log in to access the dashboard.</p>
      <Link to="/login" className="login-link">Login</Link>
    </div>
  );
};

export default Home;
