import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig'; // Import our new API client
import './AuthForm.css';
import Navbar from '../components/Navbar.jsx';

const SubmitGrievance = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // 1. Add submitting state
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true); // 2. Set submitting to true

    if (!image) {
      setError('Please select an image file.');
      return;
    }

    // FormData is required for sending files
    const formData = new FormData();

    const grievanceJson = JSON.stringify({ title, description });
    formData.append('grievance', grievanceJson);
    formData.append('image', image);

    try {
      // Use our apiClient to make the authenticated request
      await apiClient.post('/grievances', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // On success, navigate back to the dashboard
      navigate('/');
    } catch (err) {
      setError('Failed to submit grievance. Please try again.');
      console.error(err);
    } finally {
        setIsSubmitting(false); // 3. Set submitting back to false
    }
  };

  return (
    <>
        <Navbar />
        <div className="auth-container">
          <form className="auth-form" onSubmit={handleSubmit}>
            <h2>Report a New Grievance</h2>
            <div className="form-group">
            <label htmlFor="title">Title</label>
            <input type="text" id="title" required value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea id="description" required value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="form-group">
            <label htmlFor="image">Upload Image</label>
            <input type="file" id="image" required accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Grievance'}
            </button>
          </form>
        </div>
    </>
  );
};

export default SubmitGrievance;