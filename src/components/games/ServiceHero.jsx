import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FaTools, FaClock, FaStar } from 'react-icons/fa';
import './Games.css';

const ServiceHero = () => {
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(30);
  const [tasks, setTasks] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [level, setLevel] = useState(1);
  const gameRef = useRef(null);
  const timerRef = useRef(null);
  const taskIntervalRef = useRef(null);

  const getTaskSpeed = useCallback(() => {
    return Math.max(1000, 3000 - (level * 200));
  }, [level]);

  const getMaxTasks = useCallback(() => {
    return Math.min(8, 3 + Math.floor(level / 2));
  }, [level]);

  const serviceTypes = [
    { type: 'Plumbing', icon: '🔧', points: 10, time: 5 },
    { type: 'Electrical', icon: '⚡', points: 15, time: 4 },
    { type: 'Appliance', icon: '🔌', points: 20, time: 6 },
    { type: 'Carpentry', icon: '🔨', points: 12, time: 5 }
  ];

  const generateTask = () => {
    const service = serviceTypes[Math.floor(Math.random() * serviceTypes.length)];
    const position = Math.random() * 80 + 10; // Random position 10-90%
    return {
      id: Date.now(),
      ...service,
      position,
      completed: false,
      createdAt: Date.now(),
      expiresAt: Date.now() + 5000 // Task expires after 5 seconds
    };
  };

  useEffect(() => {
    if (isPlaying && !gameOver) {
      // Clear any existing intervals
      if (timerRef.current) clearInterval(timerRef.current);
      if (taskIntervalRef.current) clearInterval(taskIntervalRef.current);

      // Start task generation
      taskIntervalRef.current = setInterval(() => {
        if (tasks.length < getMaxTasks()) {
          setTasks(prev => {
            // Remove expired tasks
            const now = Date.now();
            const activeTasks = prev.filter(task => 
              !task.completed && now < task.expiresAt
            );
            
            // Add new task if we have room
            if (activeTasks.length < getMaxTasks()) {
              return [...activeTasks, generateTask()];
            }
            return activeTasks;
          });
        }
      }, getTaskSpeed());

      // Start timer
      timerRef.current = setInterval(() => {
        setTime(prev => {
          if (prev <= 1) {
            setGameOver(true);
            setIsPlaying(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Cleanup expired tasks every 100ms
      const cleanupInterval = setInterval(() => {
        setTasks(prev => {
          const now = Date.now();
          return prev.filter(task => 
            task.completed || now < task.expiresAt
          );
        });
      }, 100);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (taskIntervalRef.current) clearInterval(taskIntervalRef.current);
        clearInterval(cleanupInterval);
      };
    }
  }, [isPlaying, gameOver, tasks.length, getMaxTasks, getTaskSpeed]);

  // Level up when score reaches threshold
  useEffect(() => {
    if (isPlaying && score > 0 && score % 50 === 0) {
      setLevel(prev => prev + 1);
    }
  }, [score, isPlaying]);

  const handleTaskClick = (taskId) => {
    if (!isPlaying || gameOver) return;
    setTasks(prev => prev.map(task => {
      if (task.id === taskId && !task.completed) {
        setScore(prev => prev + task.points);
        return { ...task, completed: true };
      }
      return task;
    }));
  };

  const startGame = () => {
    // Reset all game state
    if (timerRef.current) clearInterval(timerRef.current);
    if (taskIntervalRef.current) clearInterval(taskIntervalRef.current);
    setScore(0);
    setTime(30);
    setTasks([]);
    setGameOver(false);
    setIsPlaying(true);
    setLevel(1);
  };

  return (
    <div className="service-hero">
      <div className="game-info">
        <div className="level">
          <FaStar /> Level: {level}
        </div>
        <div className="score">
          <FaStar /> Score: {score}
        </div>
        <div className="time">
          <FaClock /> Time: {time}s
        </div>
      </div>

      {!isPlaying && !gameOver && (
        <div className="start-screen">
          <h2>Service Hero</h2>
          <p>Click on service requests quickly to earn points!</p>
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

      {isPlaying && (
        <div className="game-area">
          {tasks.map(task => {
            // Only show tasks that aren't completed and haven't expired
            if (task.completed || Date.now() >= task.expiresAt) return null;
            
            // Calculate remaining time for task
            const remainingTime = Math.max(0, (task.expiresAt - Date.now()) / 1000);
            const opacity = Math.min(1, remainingTime);
            
            return (
              <div
                key={task.id}
                className="service-task"
                style={{
                  left: `${task.position}%`,
                  opacity: opacity
                }}
                onClick={() => handleTaskClick(task.id)}
              >
                <span className="task-icon">{task.icon}</span>
                <span className="task-type">{task.type}</span>
                <span className="task-points">+{task.points}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ServiceHero;
