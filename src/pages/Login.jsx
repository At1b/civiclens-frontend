import React, { useState } from 'react';
import apiClient from '../api/axiosConfig.js';
import { useNavigate, Link } from 'react-router-dom';
import './AuthForm.css'; // We'll reuse the same styles
import Navbar from '../components/Navbar.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // // 1. Send login credentials to the backend
      // const response = await apiClient.post('http://localhost:8081/api/auth/login', formData);
      
      // // 2. Get the token from the response
      // const token = response.data.token;
      
      // // 3. Store the token in the browser's local storage
      // localStorage.setItem('token', token);
      // console.log('Login successful, token stored!');
      
      // // 4. Redirect the user to the main dashboard
      // navigate('/');
      await login(formData); // <-- USE the login function
      navigate('/');

    } catch (err) {
      setError('Login failed. Please check your credentials.');
      console.error(err);
    }
  };

  return (
    <>
        <Navbar />
        <div className="auth-container">
        <form className="auth-form" onSubmit={handleSubmit}>
            <h2>Welcome Back</h2>
            <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" name="email" required onChange={handleChange} />
            </div>
            <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" required onChange={handleChange} />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit">Login</button>
            <p className="auth-link">
            Don't have an account? <Link to="/register">Register here</Link>
            </p>
        </form>
        </div>
    </>
  );
};

export default Login;