// src/components/WorkerLogin.jsx
import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import "./WorkerLogin.css";

const WorkerLogin = () => {
  const [activeTab, setActiveTab] = useState("login");
  const { isAuthenticated, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [signupData, setSignupData] = useState({
    username: "",
    phone: "",
    email: "",
    password: "",
  });
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  // After login, redirect to /workers-dashboard by default.
  const from = location.state?.from?.pathname || "/workers-dashboard";

  const handleToggle = () => {
    setActiveTab((prev) => (prev === "login" ? "signup" : "login"));
  };

  const handleSignupChange = (e) => {
    setSignupData({
      ...signupData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      // Posting sign-up data to the API endpoint
      await axios.post("http://localhost:5001/api/worker-auth/signup", signupData);
      alert("Sign up successful! Please complete your worker details.");
      // Navigate to the new WorkerForm page after successful signup
      navigate("/worker-form");
    } catch (error) {
      alert(error.response?.data?.error || "Signup failed");
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5001/api/worker-auth/login", loginData);
      const { token, user } = response.data;
      login(token, user);
      navigate(from, { replace: true });
    } catch (error) {
      alert(error.response?.data?.error || "Login failed");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  return (
    <div className="login-container">
      <h1 className="login-heading">WELCOME TO WORKER PORTAL</h1>
      <div className="switch-container">
        <span className={`switch-label ${activeTab === "login" ? "active" : ""}`}>
          LOG IN
        </span>
        <label className="switch">
          <input type="checkbox" checked={activeTab === "signup"} onChange={handleToggle} />
          <span className="slider round"></span>
        </label>
        <span className={`switch-label ${activeTab === "signup" ? "active" : ""}`}>
          SIGN UP
        </span>
      </div>
      <div className="card login-card">
        <div className="flip-container">
          <div className={`flipper ${activeTab === "signup" ? "flipped" : ""}`}>
            <div className="front">
              <h2 className="card-title">Log In</h2>
              <form onSubmit={handleLoginSubmit}>
                <input
                  type="text"
                  name="username"
                  placeholder="User Name"
                  value={loginData.username}
                  onChange={handleLoginChange}
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  required
                />
                <button type="submit">LOG IN</button>
              </form>
            </div>
            <div className="back">
              <h2 className="card-title">Sign Up</h2>
              <form onSubmit={handleSignupSubmit}>
                <input
                  type="text"
                  name="username"
                  placeholder="User Name"
                  value={signupData.username}
                  onChange={handleSignupChange}
                  required
                />
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  value={signupData.phone}
                  onChange={handleSignupChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={signupData.email}
                  onChange={handleSignupChange}
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Set Password"
                  value={signupData.password}
                  onChange={handleSignupChange}
                  required
                />
                <button type="submit">Sign Up</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerLogin;
