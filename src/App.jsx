// src/App.jsx
import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginPage from "./components/LoginPage";
import WorkerSection from "./components/WorkerSection";
import WorkerDetailsPage from "./components/WorkerDetailsPage";
import TicketSection from "./components/TicketSection";
import TicketDetailsPage from "./components/TicketDetailsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ImageSlider from "./components/ImageSlider";
import Footer from "./components/Footer";
import Select from "./components/Select";
import WorkerLogin from "./components/WorkerLogin";
import WorkersDashboard from "./components/WorkersDashboard";
import WorkerForm from "./components/WorkerForm";  // Import the new WorkerForm
import Chatbox from "./components/Chatbox"; 

function App() {
  const location = useLocation();
  const showSlider = location.pathname === "/workers";

  return (
    <div className="App">
      <Navbar />
      {showSlider && <ImageSlider />}
      <Routes>
        <Route path="/" element={<Navigate to="/workers" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/workers" element={<WorkerSection />} />
        <Route path="/select" element={<Select />} />
        <Route path="/worker-login" element={<WorkerLogin />} />
        <Route path="/worker-form" element={<WorkerForm />} />
        <Route 
          path="/workers-dashboard" 
          element={
            <ProtectedRoute>
              <WorkersDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workers/:categoryId"
          element={
            <ProtectedRoute>
              <WorkerDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route path="/tickets" element={<TicketSection />} />
        <Route
          path="/tickets/:sectorId"
          element={
            <ProtectedRoute>
              <TicketDetailsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
      <Chatbox />
    </div>
  );
}

export default App;
