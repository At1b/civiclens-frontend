import React, { useState } from 'react';
import apiClient from '../api/axiosConfig.js';
import { useNavigate } from 'react-router-dom';
import './AuthForm.css'; // We'll create this for styling
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await apiClient.post('http://localhost:8081/api/auth/register', formData);
      console.log('Registration successful:', response.data);
      // After successful registration, automatically navigate to the login page
      navigate('/login');
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error(err);
    }
  };

  return (
    <>
        <Navbar />
        <div className="auth-container">
        <form className="auth-form" onSubmit={handleSubmit}>
            <h2>Create Your Account</h2>
            <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input type="text" id="name" name="name" required onChange={handleChange} />
            </div>
            <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" name="email" required onChange={handleChange} />
            </div>
            <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" required onChange={handleChange} />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit">Register</button>
            <p className="auth-link">
                Already have an account? <Link to="/login">Login here</Link>
            </p>
        </form>
        </div>
    </>
  );
};

export default Register;