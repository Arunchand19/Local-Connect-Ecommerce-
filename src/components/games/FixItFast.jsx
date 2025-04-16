import React, { useState, useEffect } from 'react';
import { FaWrench, FaClock, FaTrophy } from 'react-icons/fa';
import './Games.css';

const FixItFast = () => {
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(60);
  const [currentPuzzle, setCurrentPuzzle] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const puzzles = [
    {
      type: 'Wire',
      pattern: ['red', 'blue', 'green', 'yellow'],
      instruction: 'Connect matching colored wires',
      points: 10
    },
    {
      type: 'Pipe',
      pattern: ['straight', 'corner', 'corner', 'straight'],
      instruction: 'Arrange pipes to create a flow',
      points: 15
    },
    {
      type: 'Circuit',
      pattern: ['switch', 'wire', 'bulb', 'battery'],
      instruction: 'Complete the circuit',
      points: 20
    }
  ];

  const generatePuzzle = () => {
    const puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
    return {
      ...puzzle,
      pieces: [...puzzle.pattern].sort(() => Math.random() - 0.5),
      solution: [...puzzle.pattern]
    };
  };

  useEffect(() => {
    if (isPlaying && !gameOver) {
      const timeInterval = setInterval(() => {
        setTime(prev => {
          if (prev <= 1) {
            setGameOver(true);
            setIsPlaying(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      if (!currentPuzzle) {
        setCurrentPuzzle(generatePuzzle());
      }

      return () => clearInterval(timeInterval);
    }
  }, [isPlaying, gameOver, currentPuzzle]);

  const handlePieceClick = (index) => {
    if (!currentPuzzle || !isPlaying) return;

    const newPieces = [...currentPuzzle.pieces];
    const clickedPiece = newPieces[index];
    
    // Rotate or swap pieces based on puzzle type
    if (currentPuzzle.type === 'Pipe') {
      newPieces[index] = clickedPiece === 'straight' ? 'corner' : 'straight';
    } else {
      // For other puzzles, swap with adjacent piece
      if (index < newPieces.length - 1) {
        newPieces[index] = newPieces[index + 1];
        newPieces[index + 1] = clickedPiece;
      }
    }

    const updatedPuzzle = { ...currentPuzzle, pieces: newPieces };
    setCurrentPuzzle(updatedPuzzle);

    // Check if puzzle is solved
    if (JSON.stringify(newPieces) === JSON.stringify(currentPuzzle.solution)) {
      setScore(prev => prev + currentPuzzle.points);
      setCurrentPuzzle(generatePuzzle());
    }
  };

  const startGame = () => {
    setScore(0);
    setTime(60);
    setCurrentPuzzle(generatePuzzle());
    setGameOver(false);
    setIsPlaying(true);
  };

  return (
    <div className="fix-it-fast">
      <div className="game-info">
        <div className="score">
          <FaTrophy /> Score: {score}
        </div>
        <div className="time">
          <FaClock /> Time: {time}s
        </div>
      </div>

      {!isPlaying && !gameOver && (
        <div className="start-screen">
          <h2>Fix It Fast</h2>
          <p>Solve repair puzzles as quickly as you can!</p>
          <button className="start-button" onClick={startGame}>Start Game</button>
        </div>
      )}

      {gameOver && (
        <div className="game-over">
          <h2>Game Over!</h2>
          <p>Final Score: {score}</p>
          <button className="start-button" onClick={startGame}>Play Again</button>
        </div>
      )}

      {isPlaying && currentPuzzle && (
        <div className="puzzle-area">
          <div className="puzzle-instruction">
            <FaWrench /> {currentPuzzle.instruction}
          </div>
          <div className="puzzle-pieces">
            {currentPuzzle.pieces.map((piece, index) => (
              <div
                key={index}
                className={`puzzle-piece ${piece}`}
                onClick={() => handlePieceClick(index)}
              >
                {piece === 'straight' ? '║' :
                 piece === 'corner' ? '╗' :
                 piece}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FixItFast;
