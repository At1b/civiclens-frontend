import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import './App.css';

function App() {
  // This component now only defines the main layout
  return (
    <>
      <Navbar />
      <main className="page-content">
        {/* Child routes defined in main.jsx will render here */}
        <Outlet /> 
      </main>
    </>
  );
}

export default App;