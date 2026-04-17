import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'motion/react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const INITIAL_SPEED = 150;

type Point = { x: number; y: number };

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const directionRef = useRef(INITIAL_DIRECTION);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setGameOver(false);
    setFood(generateFood(INITIAL_SNAKE));
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (directionRef.current.y !== 1) {
            setDirection({ x: 0, y: -1 });
            directionRef.current = { x: 0, y: -1 };
          }
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (directionRef.current.y !== -1) {
            setDirection({ x: 0, y: 1 });
            directionRef.current = { x: 0, y: 1 };
          }
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (directionRef.current.x !== 1) {
            setDirection({ x: -1, y: 0 });
            directionRef.current = { x: -1, y: 0 };
          }
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (directionRef.current.x !== -1) {
            setDirection({ x: 1, y: 0 });
            directionRef.current = { x: 1, y: 0 };
          }
          break;
        case ' ':
          e.preventDefault();
          setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + direction.x,
          y: head.y + direction.y,
        };

        // Wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Self collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, Math.max(50, INITIAL_SPEED - score * 2));
    return () => clearInterval(intervalId);
  }, [direction, food, gameOver, isPaused, score, generateFood]);

  return (
    <div id="snake-game-container" className="flex flex-col items-center">
      <div id="game-dashboard" className="w-full flex justify-between items-center mb-4 px-2 border-b-2 border-magenta-500 pb-2">
        <div id="score-display" className="text-xl text-cyan-400">
          SCORE: <span className="text-white glitch-text" data-text={score.toString().padStart(4, '0')}>{score.toString().padStart(4, '0')}</span>
        </div>
        <div id="system-status-indicator" className="text-sm text-magenta-500 animate-pulse">
          {isPaused ? 'SYSTEM_PAUSED' : 'SYSTEM_ACTIVE'}
        </div>
      </div>

      <div 
        id="game-grid-canvas"
        className="relative border-glitch bg-black grid"
        style={{
          width: '400px',
          height: '400px',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        }}
      >
        {/* Render food */}
        <div 
          id="snake-food"
          className="bg-magenta-500 rounded-sm shadow-[0_0_10px_#FF00FF] animate-pulse"
          style={{
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
          }}
        />

        {/* Render snake */}
        {snake.map((segment, index) => (
          <div
            key={`${segment.x}-${segment.y}-${index}`}
            className="bg-cyan-400 shadow-[0_0_5px_#00FFFF]"
            style={{
              gridColumnStart: segment.x + 1,
              gridRowStart: segment.y + 1,
              opacity: 1 - (index / snake.length) * 0.5,
              borderRadius: index === 0 ? '4px' : '0'
            }}
          />
        ))}

        {gameOver && (
          <motion.div 
            id="game-over-overlay"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center backdrop-blur-sm z-10"
          >
            <h2 className="text-4xl text-red-500 glitch-text mb-4" data-text="FATAL_ERROR">FATAL_ERROR</h2>
            <p className="text-cyan-400 mb-6 font-pixel text-xl">SCORE: {score}</p>
            <button 
              id="reboot-system-btn"
              onClick={resetGame}
              className="min-h-[44px] min-w-[44px] px-6 py-2 border-2 border-magenta-500 text-magenta-500 hover:bg-magenta-500 hover:text-black hover:shadow-[0_0_15px_#FF00FF] transition-all uppercase text-xl font-bold cursor-pointer"
            >
              REBOOT_SYSTEM
            </button>
          </motion.div>
        )}
      </div>

      <div id="game-controls-help" className="mt-4 text-xs text-gray-500 flex gap-4">
        <span>[WASD/ARROWS] = MOVE</span>
        <span>[SPACE] = PAUSE</span>
      </div>
    </div>
  );
}
