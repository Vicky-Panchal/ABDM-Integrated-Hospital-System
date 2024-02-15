import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h2>Welcome to the Home Page</h2>
      <p>This is a simple home page for our application.</p>
      <p>Please log in to access the dashboard.</p>
      <Link to="/login">Login</Link>
    </div>
  );
};

export default Home;
