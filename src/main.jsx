import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';

import App from './App.jsx'; // The main layout
import Dashboard from './pages/Dashboard.jsx'; // Our renamed dashboard
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import SubmitGrievance from './pages/SubmitGrievance.jsx';
import GrievanceDetail from './pages/GrievanceDetail.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* The App component is now the parent layout for all other routes */}
          <Route path="/" element={<App />}>
            {/* The Dashboard is the default page for the "/" path */}
            <Route index element={<Dashboard />} /> 
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
            <Route 
              path="submit" 
              element={ <ProtectedRoute> <SubmitGrievance /> </ProtectedRoute> } 
            />
            <Route path="grievance/:id" element={<GrievanceDetail />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);