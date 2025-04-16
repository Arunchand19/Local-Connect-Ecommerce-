import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGamepad, FaDice, FaTools, FaClock } from 'react-icons/fa';
import { GiSnake } from 'react-icons/gi';
import './Games.css';

const GamesPage = () => {
  const navigate = useNavigate();

  const games = [
    {
      id: 'tictactoe',
      name: 'Tic Tac Toe',
      description: "Challenge our AI in this classic game of X's and O's",
      icon: <FaDice className="game-card-icon" />,
      color: '#e74c3c',
    },
    {
      id: 'snake',
      name: 'Snake Game',
      description: 'Navigate the snake, collect food, and try to achieve the highest score!',
      icon: <GiSnake className="game-card-icon" />,
      color: '#2ecc71',
    },
    {
      id: 'servicehero',
      name: 'Service Hero',
      description: 'Race against time to complete service requests and become the ultimate repair hero!',
      icon: <FaTools className="game-card-icon" />,
      color: '#3498db',
    },
    {
      id: 'servicematch',
      name: 'Service Match',
      description: 'Match pairs of service cards to level up! Test your memory and speed.',
      icon: <FaGamepad className="game-card-icon" />,
      color: '#9b59b6',
    },
  ];

  return (
    <div className="games-page">
      <div className="games-header">
        <FaGamepad className="games-header-icon" />
        <h1>Game Center</h1>
        <p>Choose your game and start playing!</p>
      </div>
      
      <div className="games-grid">
        {games.map(game => (
          <div 
            key={game.id}
            className="game-card"
            style={{'--card-color': game.color}}
            onClick={() => navigate(`/games/${game.id}`)}
          >
            <div className="game-card-content">
              <div className="game-card-icon-wrapper" style={{backgroundColor: game.color}}>
                {game.icon}
              </div>
              <h2>{game.name}</h2>
              <p>{game.description}</p>
              <button className="play-button">
                Play Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GamesPage;
