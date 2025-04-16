import React, { useState, useEffect, useCallback } from 'react';
import './Games.css';

const Snake = () => {
  const GRID_SIZE = 20;
  const CELL_SIZE = 20;
  const INITIAL_SNAKE = [{ x: 10, y: 10 }];
  const INITIAL_DIRECTION = { x: 1, y: 0 };
  const GAME_SPEED = 150;

  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood());
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake(currentSnake => {
      const newHead = {
        x: (currentSnake[0].x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (currentSnake[0].y + direction.y + GRID_SIZE) % GRID_SIZE
      };

      // Check if snake hits itself
      if (currentSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return currentSnake;
      }

      const newSnake = [newHead, ...currentSnake];

      // Check if food is eaten
      if (newHead.x === food.x && newHead.y === food.y) {
        setFood(generateFood());
        setScore(s => s + 10);
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameOver) return;

      const keyDirections = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 }
      };

      if (keyDirections[e.key]) {
        const newDirection = keyDirections[e.key];
        setDirection(currentDirection => {
          // Prevent moving in opposite direction
          if (currentDirection.x === -newDirection.x || 
              currentDirection.y === -newDirection.y) {
            return currentDirection;
          }
          return newDirection;
        });
      }

      if (e.key === ' ') {
        setIsPaused(p => !p);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameOver]);

  useEffect(() => {
    const gameLoop = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameLoop);
  }, [moveSnake]);

  return (
    <div className="snake-game">
      <h2>Snake Game</h2>
      <div className="game-info">
        <div>Score: {score}</div>
        {gameOver && <div className="game-over">Game Over!</div>}
        {isPaused && <div className="paused">Paused</div>}
      </div>
      <div 
        className="game-board"
        style={{
          width: GRID_SIZE * CELL_SIZE + 'px',
          height: GRID_SIZE * CELL_SIZE + 'px'
        }}
      >
        {snake.map((segment, index) => (
          <div
            key={index}
            className="snake-segment"
            style={{
              left: segment.x * CELL_SIZE + 'px',
              top: segment.y * CELL_SIZE + 'px',
              width: CELL_SIZE + 'px',
              height: CELL_SIZE + 'px'
            }}
          />
        ))}
        <div
          className="food"
          style={{
            left: food.x * CELL_SIZE + 'px',
            top: food.y * CELL_SIZE + 'px',
            width: CELL_SIZE + 'px',
            height: CELL_SIZE + 'px'
          }}
        />
      </div>
      <div className="controls">
        <button onClick={resetGame}>New Game</button>
        <button onClick={() => setIsPaused(p => !p)}>
          {isPaused ? 'Resume' : 'Pause'}
        </button>
      </div>
      <div className="instructions">
        <p>Use arrow keys to move</p>
        <p>Space to pause/resume</p>
      </div>
    </div>
  );
};

export default Snake;
