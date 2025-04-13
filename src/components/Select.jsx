import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserTie, FaUsers, FaAngleRight } from "react-icons/fa";
import "./Select.css";

const Select = () => {
  const navigate = useNavigate();

  return (
    <div className="select-container">
      <div className="select-content">
        <h1 className="select-heading">Choose Your Role</h1>
        <div className="select-buttons">
          <button className="select-btn workers-btn" onClick={() => navigate("/worker-login")}>
            <div className="btn-content">
              <div className="btn-icon">
                <FaUserTie />
              </div>
              <span className="btn-text">Workers</span>
              <FaAngleRight className="arrow-icon" />
            </div>
          </button>
          <button className="select-btn customers-btn" onClick={() => navigate("/login")}>
            <div className="btn-content">
              <div className="btn-icon">
                <FaUsers />
              </div>
              <span className="btn-text">Customers</span>
              <FaAngleRight className="arrow-icon" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Select;
