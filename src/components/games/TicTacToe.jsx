import React, { useState, useEffect } from 'react';
import './Games.css';

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(''));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

  const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];

  const checkWinner = (squares) => {
    for (let combo of winningCombos) {
      const [a, b, c] = combo;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const isBoardFull = (squares) => {
    return squares.every(square => square !== '');
  };

  const getBotMove = (squares) => {
    // Try to win
    for (let i = 0; i < squares.length; i++) {
      if (!squares[i]) {
        const boardCopy = [...squares];
        boardCopy[i] = 'O';
        if (checkWinner(boardCopy) === 'O') return i;
      }
    }

    // Block player from winning
    for (let i = 0; i < squares.length; i++) {
      if (!squares[i]) {
        const boardCopy = [...squares];
        boardCopy[i] = 'X';
        if (checkWinner(boardCopy) === 'X') return i;
      }
    }

    // Take center if available
    if (!squares[4]) return 4;

    // Take random available corner
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(i => !squares[i]);
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }

    // Take any available space
    const availableSpaces = squares.map((square, i) => !square ? i : null).filter(i => i !== null);
    return availableSpaces[Math.floor(Math.random() * availableSpaces.length)];
  };

  useEffect(() => {
    if (!isPlayerTurn && !gameOver) {
      const timer = setTimeout(() => {
        const botMove = getBotMove(board);
        const newBoard = [...board];
        newBoard[botMove] = 'O';
        setBoard(newBoard);
        
        const winner = checkWinner(newBoard);
        if (winner) {
          setGameOver(true);
          setWinner(winner);
        } else if (isBoardFull(newBoard)) {
          setGameOver(true);
          setWinner('draw');
        } else {
          setIsPlayerTurn(true);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, board, gameOver]);

  const handleClick = (index) => {
    if (board[index] || !isPlayerTurn || gameOver) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);

    const winner = checkWinner(newBoard);
    if (winner) {
      setGameOver(true);
      setWinner(winner);
    } else if (isBoardFull(newBoard)) {
      setGameOver(true);
      setWinner('draw');
    } else {
      setIsPlayerTurn(false);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(''));
    setIsPlayerTurn(true);
    setGameOver(false);
    setWinner(null);
  };

  return (
    <div className="tic-tac-toe">
      <h2>Tic Tac Toe</h2>
      <div className="game-status">
        {gameOver ? (
          <div className="game-over">
            {winner === 'draw' ? 
              'Game Draw!' : 
              `${winner === 'X' ? 'You Win!' : 'Bot Wins!'}`}
            <button onClick={resetGame}>Play Again</button>
          </div>
        ) : (
          <div>{isPlayerTurn ? 'Your Turn' : 'Bot Thinking...'}</div>
        )}
      </div>
      <div className="board">
        {board.map((cell, index) => (
          <div
            key={index}
            className={`cell ${cell}`}
            onClick={() => handleClick(index)}
          >
            {cell}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicTacToe;
