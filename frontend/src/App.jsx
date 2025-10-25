import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Signup from './pages/Signup';
import Login from './pages/Login';
import CitizenDashboard from './pages/CitizenDashboard';
import OfficialDashboard from './pages/OfficialDashboard';
import TrackComplaint from './pages/TrackComplaint';

function Protected({ children }){
  const token = localStorage.getItem('token');
  if(!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App(){
  return (
    <Routes>
      <Route path="/" element={<LandingPage/>} />
      <Route path="/signup" element={<Signup/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/dashboard" element={<Protected><CitizenDashboard/></Protected>} />
      <Route path="/official" element={<Protected><OfficialDashboard/></Protected>} />
      <Route path="/track/:id" element={<TrackComplaint/>} />
    </Routes>
  );
}
