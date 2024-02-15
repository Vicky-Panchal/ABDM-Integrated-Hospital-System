// Login.js

import React, { useState } from 'react';
import '../Styles/login.css'; // Import the CSS file

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');


  //const handleLogin = async (e) => {
  //  e.preventDefault();
  //  try {
  //    const response = await axios.post('/api/login', { username, password });
  //    if (response.data.success) {
  //      // Store user login info in localStorage
  //      localStorage.setItem('isLoggedIn', true);
  //      // Redirect to dashboard upon successful login
  //      window.location.href = '/dashboard';
  //    } else {
  //      setError('Invalid username or password');
  //    }
  //  } catch (error) {
  //    console.error('Error logging in:', error);
  //    setError('An unexpected error occurred');
  //  }
  //};


  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate successful login (no backend authentication)
    if (username === 'admin' && password === 'password') {
      // Store user login info in localStorage
      localStorage.setItem('isLoggedIn', true);
      // Redirect to dashboard upon successful login
      window.location.href = '/selectoption';
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-heading">Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label className="form-label">Username:</label>
          <input type="text" className="form-input" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="form-label">Password:</label>
          <input type="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="login-button">Login</button>
        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
};

export default Login;
