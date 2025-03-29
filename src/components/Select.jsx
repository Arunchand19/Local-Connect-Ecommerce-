import React from "react";
import { useNavigate } from "react-router-dom";
import "./Select.css";

const Select = () => {
  const navigate = useNavigate();

  return (
    <div className="select-container">
      <h1 className="select-heading">Choose Your Role</h1>
      <div className="select-buttons">
        <button className="select-btn workers-btn" onClick={() => navigate("/worker-login")}>
          Workers
        </button>
        <button className="select-btn customers-btn" onClick={() => navigate("/login")}>
          Customers
        </button>
      </div>
    </div>
  );
};

export default Select;
