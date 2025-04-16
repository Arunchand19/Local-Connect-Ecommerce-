import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGamepad } from 'react-icons/fa';
import './Games.css';

const GamesMenu = () => {
  const navigate = useNavigate();

  return (
    <div className="games-menu" onClick={() => navigate('/games')}>
      <div className="games-icon">
        <FaGamepad size={24} />
        <span className="games-text">Games</span>
      </div>
    </div>
  );
};

export default GamesMenu;
