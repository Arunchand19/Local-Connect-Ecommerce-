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
import Contact from "./components/Contact";  // Add this import

import Cart from "./components/Cart";             // New Cart page
import PaymentSuccess from "./components/PaymentSuccess"; // Payment success page
import { AuthProvider } from "./AuthContext";       // Existing Auth context
import { CartProvider } from "./components/CartContext";       // New Cart context
import WorkerForm from "./components/WorkerForm";  // Import the new WorkerForm
import Chatbox from "./components/Chatbox"; 
import SellBuy from "./components/SellBuy";
import ConcertForm from "./components/ConcertForm";
import SportsForm from "./components/SportsForm";
import TheaterForm from "./components/TheaterForm";
import FestivalsForm from "./components/FestivalsForm";
import ConcertTicketList from "./components/ConcertTicketList";
import SportsTicketList from "./components/SportsTicketList";
import TheaterTicketList from "./components/TheaterTicketList";
import FestivalsTicketList from "./components/FestivalsTicketList";
import ReviewForm from "./components/ReviewForm"; // Import ReviewForm component
import WorkerReviews from "./components/WorkerReviews"; // Import WorkerReviews component
import GamesPage from "./components/games/GamesPage";
import GamePage from "./components/games/GamePage";

function App() {
  const location = useLocation();
  const showSlider = location.pathname === "/" || location.pathname === "/workers" || location.pathname === "/tickets";

  return (

<AuthProvider>
<CartProvider>
    <div className="App">
      <Navbar />
      {showSlider && <ImageSlider />}
      <Routes>
        <Route path="/" element={
          <>
            <WorkerSection />
          </>
        } />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/workers" element={<Navigate to="/" />} />
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
          path="/tickets/sellbuy/:sectorId"
          element={
            <ProtectedRoute>
              <SellBuy />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tickets/concert/form"
          element={
            <ProtectedRoute>
              <ConcertForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tickets/sports/form"
          element={
            <ProtectedRoute>
              <SportsForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tickets/theater/form"
          element={
            <ProtectedRoute>
              <TheaterForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tickets/festivals/form"
          element={
            <ProtectedRoute>
              <FestivalsForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tickets/concert"
          element={
            <ProtectedRoute>
              <ConcertTicketList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tickets/sports"
          element={
            <ProtectedRoute>
              <SportsTicketList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tickets/theater"
          element={
            <ProtectedRoute>
              <TheaterTicketList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tickets/festival"
          element={
            <ProtectedRoute>
              <FestivalsTicketList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tickets/:sectorId"
          element={
            <ProtectedRoute>
              <TicketDetailsPage />
            </ProtectedRoute>
          }
        />

<Route path="/cart" element={<Cart />} /> {/* New Cart route */}
<Route path="/payment-success" element={<PaymentSuccess />} /> {/* Payment success route */}
        {/*<Route path="/cart" element={<Cart />} />  New Cart route  */}
        
        {/* Reviews routes */}
        <Route
          path="/reviews"
          element={<WorkerReviews />}
        />
        <Route
          path="/add-review"
          element={
            <ProtectedRoute>
              <ReviewForm />
            </ProtectedRoute>
          }
        />
        <Route path="/contact" element={<Contact />} /> {/* New Contact route */}
        
        {/* Games routes */}
        <Route path="/games" element={<GamesPage />} />
        <Route path="/games/:gameId" element={<GamePage />} />

      </Routes>
      <Footer />
      <Chatbox />
    </div>

      </CartProvider>
    </AuthProvider>
  );
}

export default App;
