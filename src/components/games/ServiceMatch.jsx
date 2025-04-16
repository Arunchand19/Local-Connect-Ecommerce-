import React, { useState, useEffect, useCallback } from 'react';
import { FaStar, FaClock, FaSync } from 'react-icons/fa';
import './Games.css';

const ServiceMatch = () => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [level, setLevel] = useState(1);

  const serviceCards = [
    { id: 'plumber1', type: 'plumber', icon: '🔧', color: '#3498db' },
    { id: 'plumber2', type: 'plumber', icon: '🔧', color: '#3498db' },
    { id: 'electrician1', type: 'electrician', icon: '⚡', color: '#f1c40f' },
    { id: 'electrician2', type: 'electrician', icon: '⚡', color: '#f1c40f' },
    { id: 'carpenter1', type: 'carpenter', icon: '🔨', color: '#e67e22' },
    { id: 'carpenter2', type: 'carpenter', icon: '🔨', color: '#e67e22' },
    { id: 'painter1', type: 'painter', icon: '🎨', color: '#e74c3c' },
    { id: 'painter2', type: 'painter', icon: '🎨', color: '#e74c3c' },
    { id: 'gardener1', type: 'gardener', icon: '🌿', color: '#2ecc71' },
    { id: 'gardener2', type: 'gardener', icon: '🌿', color: '#2ecc71' },
    { id: 'cleaner1', type: 'cleaner', icon: '🧹', color: '#9b59b6' },
    { id: 'cleaner2', type: 'cleaner', icon: '🧹', color: '#9b59b6' },
    { id: 'appliance1', type: 'appliance', icon: '🔌', color: '#34495e' },
    { id: 'appliance2', type: 'appliance', icon: '🔌', color: '#34495e' },
    { id: 'ac1', type: 'ac', icon: '❄️', color: '#16a085' },
    { id: 'ac2', type: 'ac', icon: '❄️', color: '#16a085' }
  ];

  const getCardsForLevel = useCallback(() => {
    const pairsCount = Math.min(4 + level, 8); // Increase pairs with level, max 8 pairs
    const shuffled = [...serviceCards]
      .sort(() => Math.random() - 0.5)
      .slice(0, pairsCount * 2);
    return shuffled.map((card, index) => ({
      ...card,
      position: index
    }));
  }, [level]);

  const handleCardClick = (cardId) => {
    if (flipped.length === 2 || flipped.includes(cardId) || matched.includes(cardId) || !isPlaying) {
      return;
    }

    const newFlipped = [...flipped, cardId];
    setFlipped(newFlipped);
    setMoves(moves + 1);

    if (newFlipped.length === 2) {
      const [firstId, secondId] = newFlipped;
      const firstCard = cards.find(card => card.id === firstId);
      const secondCard = cards.find(card => card.id === secondId);

      if (firstCard.type === secondCard.type) {
        setMatched([...matched, firstId, secondId]);
        setScore(score + 10);
        setFlipped([]);

        // Check if level is complete
        if (matched.length + 2 === cards.length) {
          if (level < 8) {
            // Next level
            setLevel(level + 1);
            startNewLevel(level + 1);
          } else {
            // Game complete
            setGameOver(true);
            setIsPlaying(false);
          }
        }
      } else {
        // No match, flip back after delay
        setTimeout(() => {
          setFlipped([]);
        }, 1000);
      }
    }
  };

  const startNewLevel = (newLevel) => {
    setCards(getCardsForLevel());
    setFlipped([]);
    setMatched([]);
    setIsPlaying(true);
  };

  const startGame = () => {
    setScore(0);
    setMoves(0);
    setLevel(1);
    setGameOver(false);
    setMatched([]);
    setFlipped([]);
    setIsPlaying(true);
    setCards(getCardsForLevel());
  };

  useEffect(() => {
    if (isPlaying) {
      setCards(getCardsForLevel());
    }
  }, [isPlaying, getCardsForLevel]);

  return (
    <div className="service-match">
      <div className="game-info">
        <div className="level">
          <FaStar /> Level: {level}
        </div>
        <div className="score">
          <FaStar /> Score: {score}
        </div>
        <div className="moves">
          <FaClock /> Moves: {moves}
        </div>
      </div>

      {!isPlaying && !gameOver && (
        <div className="start-screen">
          <h2>Service Match</h2>
          <p>Match pairs of service cards to level up! More cards are added in each level.</p>
          <button className="start-button" onClick={startGame}>Start Game</button>
        </div>
      )}

      {gameOver && (
        <div className="game-over">
          <h2>Game Complete!</h2>
          <p>Final Score: {score}</p>
          <p>Total Moves: {moves}</p>
          <button className="start-button" onClick={startGame}>Play Again</button>
        </div>
      )}

      {isPlaying && (
        <div className="cards-grid">
          {cards.map(card => (
            <div
              key={card.id}
              className={`card ${flipped.includes(card.id) ? 'flipped' : ''} 
                         ${matched.includes(card.id) ? 'matched' : ''}`}
              onClick={() => handleCardClick(card.id)}
              style={{
                '--card-color': card.color
              }}
            >
              <div className="card-inner">
                <div className="card-front">
                  <FaSync />
                </div>
                <div className="card-back">
                  <span className="card-icon">{card.icon}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceMatch;
