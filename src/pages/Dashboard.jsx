import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import apiClient from '../api/axiosConfig';
import Navbar from '../components/Navbar.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import "./Dashboard.css";

function Dashboard() {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { token } = useAuth();

  // Effect for fetching initial data
  useEffect(() => {
  const searchTimer = setTimeout(() => {
    const fetchGrievances = async () => {
      setLoading(true);
      setError('');
      try {
        let response;
        if (searchTerm === '') {
          // If search is empty, get all public grievances
          response = await apiClient.get('/grievances/public');
        } else {
          // Otherwise, hit the search endpoint
          response = await apiClient.get(`/grievances/search?q=${searchTerm}`);
        }
        setGrievances(response.data);
      } catch (err) {
        setError('Failed to fetch grievances.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGrievances();
  }, 500); // Debounce for 500ms

  return () => clearTimeout(searchTimer);
}, [searchTerm]); // Re-run whenever the searchTerm changes


  // Effect for WebSocket connection
  useEffect(() => {
    if (grievances.length === 0) return;

    const stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8081/ws'),
      onConnect: () => {
        console.log('WebSocket Connected!');
        grievances.forEach(grievance => {
          stompClient.subscribe(`/topic/grievance/${grievance.id}`, (message) => {
            const update = JSON.parse(message.body);
            setGrievances(prevGrievances =>
              prevGrievances.map(g =>
                g.id === update.grievanceId ? { ...g, status: update.newStatus } : g
              )
            );
          });
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
    });

    stompClient.activate();

    return () => {
      stompClient.deactivate();
      console.log('WebSocket Disconnected.');
    };
  }, [grievances]);

  // The upvote function, simplified and clean
  const handleVote = async (event, grievanceId) => {
    event.preventDefault(); // Stop the link from navigating
    event.stopPropagation(); // Stop the click from bubbling

    if (!token) {
      alert('Please log in to vote.');
      return;
    }
    
    try {
      const response = await apiClient.post(`/grievances/${grievanceId}/vote`);
      // Update the state with the new vote count and re-sort
      setGrievances(prevGrievances =>
        prevGrievances.map(g =>
          g.id === grievanceId ? { ...g, votes: response.data.votes } : g
        ).sort((a, b) => b.votes - a.votes)
      );
    } catch (err) {
      console.error("Failed to vote", err);
      alert('An error occurred while casting your vote. Your session may have expired.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="app-container">
        <header className="app-header">
          <h1>CivicLens Public Dashboard</h1>
          <p>Community-reported issues, sorted by urgency.</p>
          <div className="search-container">
            <input 
              type="search" 
              placeholder="Search by keyword..." 
              className="search-bar"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>
        
        {loading ? (
          <p style={{ textAlign: 'center' }}>Loading grievances...</p>
        ) : (
          <main className="grievance-list">
            {error && <p className="error-message">{error}</p>}
            {grievances.map(grievance => (
              <Link key={grievance.id} to={`/grievance/${grievance.id}`} className="grievance-link">
                <div className="grievance-card">
                  {/* <div className="grievance-votes">
                    <span>{grievance.votes}</span>
                    <label>VOTES</label>
                    {token && (
                      <button 
                        className="vote-button" 
                        onClick={(event) => {
                          // This is the definitive fix:
                          event.preventDefault(); // Prevents the link from navigating
                          event.stopPropagation(); // Stops the event from bubbling up
                          handleVote(grievance.id);
                        }}
                      >
                        Upvote
                      </button>
                    )}
                  </div> */}
                  <div className="grievance-votes">
                    <span>{grievance.votes}</span>
                    <label>VOTES</label>
                    {/* Conditionally render the button ONLY if the user is logged in */}
                    {token && (
                      <button 
                        className="vote-button" 
                        onClick={(event) => handleVote(event, grievance.id)}
                      >
                        Upvote
                      </button>
                    )}
                  </div>
                  <div className="grievance-details">
                    <h2>{grievance.title}</h2>
                    <p>{grievance.description}</p>
                    <div className="grievance-meta">
                      <span className={`status status-${grievance.status?.toLowerCase().replace(' ', '_')}`}>{grievance.status}</span>
                      <span className="category">{grievance.category}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </main>
        )}
      </div>
    </>
  );
}

export default Dashboard;