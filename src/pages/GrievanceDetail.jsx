import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import Navbar from '../components/Navbar.jsx';
import './GrievanceDetail.css'; // We'll create this next

const GrievanceDetail = () => {
  const { id } = useParams(); // Gets the 'id' from the URL (e.g., /grievance/3)
  const [grievance, setGrievance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGrievance = async () => {
      try {
        const response = await apiClient.get(`/grievances/${id}`);
        setGrievance(response.data);
      } catch (err) {
        setError('Grievance not found or an error occurred.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGrievance();
  }, [id]); // Re-run this effect if the ID in the URL changes

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <>
      <Navbar />
      <div className="detail-container">
        <h1>{grievance.title}</h1>
        <div className="detail-meta">
          <span className={`status status-${grievance.status?.toLowerCase().replace(' ', '_')}`}>{grievance.status}</span>
          <span className="category">{grievance.category}</span>
          <span className="votes">{grievance.votes} Votes</span>
        </div>
        {grievance.imageUrl && <img src={grievance.imageUrl} alt={grievance.title} className="detail-image" />}
        <p className="detail-description">{grievance.description}</p>
      </div>
    </>
  );
};

export default GrievanceDetail;