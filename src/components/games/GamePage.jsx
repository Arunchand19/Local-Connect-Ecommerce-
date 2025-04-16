import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TicTacToe from './TicTacToe';
import Snake from './Snake';
import ServiceHero from './ServiceHero';
import ServiceMatch from './ServiceMatch';

import './Games.css';

const GamePage = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();

  const games = {
    tictactoe: {
      component: TicTacToe,
      name: "Tic Tac Toe",
      description: "Classic game of Xs and Os",
      background: "#2ecc71",
    },
    snake: {
      component: Snake,
      name: "Snake Game",
      description: "Collect repairs and grow your service snake!",
      background: "#e74c3c",
    },
    servicehero: {
      component: ServiceHero,
      name: "Service Hero",
      description: "Race against time to complete service requests and become the ultimate repair hero!",
      background: "#3498db",
    },
    servicematch: {
      component: ServiceMatch,
      name: "Service Match",
      description: "Match pairs of service cards to level up and test your memory!",
      background: "#9b59b6",
    },

  };

  const game = games[gameId];
  if (!game) {
    navigate('/games');
    return null;
  }

  const GameComponent = game.component;

  return (
    <div className="game-page" style={{ '--game-background': game.background }}>
      <div className="game-header">
        <h1>{game.name}</h1>
        <p>{game.description}</p>
      </div>
      <div className="game-container">
        <GameComponent />
      </div>
    </div>
  );
};

export default GamePage;
