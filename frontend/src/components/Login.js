import React, { useState } from 'react';
//import axios from 'axios';

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
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Login</button>
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </form>
    </div>
  );
};

export default Login;
