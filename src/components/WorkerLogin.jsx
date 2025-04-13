import React, { useState, useContext, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import "./WorkerLogin.css";
//import "./LiveBackground.css";

const WorkerLogin = () => {
  const [activeTab, setActiveTab] = useState("login");
  const { isAuthenticated, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const particlesRef = useRef([]);

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

  const from = location.state?.from?.pathname || "/workers-dashboard";

  useEffect(() => {
    if (!containerRef.current) return;

    const handleMouseMove = (e) => {
      if (!containerRef.current || !cardRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      cardRef.current.style.transform = `
        perspective(1000px)
        rotateX(${y * -10}deg)
        rotateY(${x * 10}deg)
        translateZ(10px)
        scale(1.02)
      `;

      const lightStreams = containerRef.current.querySelectorAll('.light-stream');
      lightStreams.forEach((stream, index) => {
        const factor = index + 1;
        stream.style.transform = `
          translateX(${x * 10 * factor}px)
          translateY(${y * 10 * factor}px)
          translateZ(-${factor * 20}px)
        `;
      });
    };

    const handleMouseLeave = () => {
      if (!cardRef.current) return;

      cardRef.current.style.transform = `
        perspective(1000px)
        rotateX(0deg)
        rotateY(0deg)
        translateZ(0)
        scale(1)
      `;

      const lightStreams = containerRef.current.querySelectorAll('.light-stream');
      lightStreams.forEach((stream) => {
        stream.style.transform = '';
      });
    };

    const createParticles = () => {
      if (!containerRef.current) return;

      const field = containerRef.current.querySelector('.particle-field');
      if (!field) return;

      field.innerHTML = '';
      particlesRef.current = [];

      for (let i = 0; i < 75; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        const size = Math.random() * 3 + 1;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const depth = Math.random() * 100;
        const speed = 5 + Math.random() * 15;
        const delay = Math.random() * 5;

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.transform = `translateZ(${depth}px)`;
        particle.style.animationDuration = `${speed}s`;
        particle.style.animationDelay = `${delay}s`;

        if (i % 3 === 0) {
          particle.style.background = "radial-gradient(circle, rgba(0,150,255,0.9) 10%, transparent 70%)";
        } else if (i % 3 === 1) {
          particle.style.background = "radial-gradient(circle, rgba(255,0,150,0.9) 10%, transparent 70%)";
        }

        field.appendChild(particle);
        particlesRef.current.push(particle);
      }
    };

    try {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseleave', handleMouseLeave);

      createParticles();

      const lightPath3 = document.createElement('div');
      lightPath3.className = 'light-path light-path--3';
      containerRef.current.querySelector('.live-background').appendChild(lightPath3);
    } catch (error) {
      console.error("Error initializing effects:", error);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);

      if (containerRef.current) {
        const field = containerRef.current.querySelector('.particle-field');
        if (field) field.innerHTML = '';

        const lightPath3 = containerRef.current.querySelector('.light-path--3');
        if (lightPath3) lightPath3.remove();
      }
    };
  }, []);

  const handleToggle = () => {
    setActiveTab((prev) => (prev === "login" ? "signup" : "login"));
  };

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5001/api/worker-auth/signup", signupData);
      alert("Sign up successful! Please complete your worker details.");
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
    <div className="login-container worker-login" ref={containerRef}>
      <div className="live-background">
        <div className="depth-layer depth-layer--1">
          <div className="light-stream light-stream--blue"></div>
        </div>
        <div className="depth-layer depth-layer--2">
          <div className="light-stream light-stream--pink"></div>
        </div>
        <div className="depth-layer depth-layer--3">
          <div className="light-stream light-stream--green"></div>
        </div>
        <div className="light-path light-path--1"></div>
        <div className="light-path light-path--2"></div>
      </div>

      <div className="particles-container">
        <div className="particle-field"></div>
      </div>

      <h1 className="login-heading">WELCOME TO WORKER PORTAL</h1>

      <div className="switch-container">
        <span className={`switch-label ${activeTab === "login" ? "active" : ""}`}>
          LOG IN
        </span>
        <label className="switch">
          <input
            type="checkbox"
            checked={activeTab === "signup"}
            onChange={handleToggle}
          />
          <span className="slider round"></span>
        </label>
        <span className={`switch-label ${activeTab === "signup" ? "active" : ""}`}>
          SIGN UP
        </span>
      </div>

      <div className="card login-card card-3d-effect" ref={cardRef}>
        <div className="flip-container card-3d-container">
          <div className={`flipper ${activeTab === "signup" ? "flipped" : ""}`}>
            <div className="front">
              <h2 className="card-title">Log In</h2>
              <div className="card-body">
                <form onSubmit={handleLoginSubmit}>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control input-field"
                      name="username"
                      placeholder="Username"
                      value={loginData.username}
                      onChange={handleLoginChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="password"
                      className="form-control input-field"
                      name="password"
                      placeholder="Password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      required
                    />
                  </div>
                  <button type="submit" className="btn login-btn">
                    LOG IN
                  </button>
                </form>
              </div>
            </div>

            <div className="back">
              <h2 className="card-title">Sign Up</h2>
              <div className="card-body">
                <form onSubmit={handleSignupSubmit}>
                  <input
                    type="text"
                    className="form-control input-field"
                    name="username"
                    placeholder="User Name"
                    value={signupData.username}
                    onChange={handleSignupChange}
                    required
                  />
                  <input
                    type="text"
                    className="form-control input-field"
                    name="phone"
                    placeholder="Phone Number"
                    value={signupData.phone}
                    onChange={handleSignupChange}
                    required
                  />
                  <input
                    type="email"
                    className="form-control input-field"
                    name="email"
                    placeholder="Email"
                    value={signupData.email}
                    onChange={handleSignupChange}
                    required
                  />
                  <input
                    type="password"
                    className="form-control input-field"
                    name="password"
                    placeholder="Password"
                    value={signupData.password}
                    onChange={handleSignupChange}
                    required
                  />
                  <button type="submit" className="btn login-btn">
                    SIGN UP
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerLogin;
