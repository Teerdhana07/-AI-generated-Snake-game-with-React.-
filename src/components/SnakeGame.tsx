import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const TICK_RATE = 100;

type Point = { x: number; y: number };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 15, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const directionRef = useRef(direction);
  directionRef.current = direction;

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    let isOccupied = true;
    while (isOccupied) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      isOccupied = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    }
    return newFood!;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setFood(generateFood(INITIAL_SNAKE));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d", " "].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' && gameOver) {
        resetGame();
        return;
      }

      if (e.key === ' ' && !gameOver) {
        setIsPaused(p => !p);
        return;
      }

      if (isPaused || gameOver) return;

      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, isPaused]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const currentDir = directionRef.current;
        const newHead = { x: head.x + currentDir.x, y: head.y + currentDir.y };

        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => {
            const newScore = s + 10;
            if (newScore > highScore) setHighScore(newScore);
            return newScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, TICK_RATE);
    return () => clearInterval(intervalId);
  }, [food, gameOver, isPaused, generateFood, highScore]);

  return (
    <div className="flex flex-col items-center w-full max-w-[400px]">
      <div className="flex justify-between w-full mb-4 border-4 border-fuchsia-600 bg-black p-2 shadow-[4px_4px_0px_#00FFFF]">
        <div className="flex flex-col">
          <span className="text-fuchsia-500 text-2xl">DATA_</span>
          <span className="text-cyan-400 text-5xl leading-none glitch" data-text={score.toString().padStart(4, '0')}>{score.toString().padStart(4, '0')}</span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-fuchsia-500 text-2xl">MAX_DATA_</span>
          <span className="text-cyan-400 text-5xl leading-none glitch" data-text={highScore.toString().padStart(4, '0')}>{highScore.toString().padStart(4, '0')}</span>
        </div>
      </div>

      <div className="relative bg-black border-4 border-cyan-500 shadow-[8px_8px_0px_#FF00FF] overflow-hidden"
           style={{ width: 400, height: 400 }}>
        
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-30" 
             style={{ 
               backgroundImage: 'linear-gradient(#FF00FF 1px, transparent 1px), linear-gradient(90deg, #FF00FF 1px, transparent 1px)',
               backgroundSize: '20px 20px'
             }}>
        </div>

        {/* Food */}
        <div 
          className="absolute bg-fuchsia-500"
          style={{
            width: 20, height: 20,
            left: food.x * 20, top: food.y * 20,
            boxShadow: '0 0 15px #FF00FF'
          }}
        />

        {/* Snake */}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          return (
            <div
              key={`${segment.x}-${segment.y}-${index}`}
              className={`absolute ${isHead ? 'bg-cyan-300 z-10' : 'bg-cyan-600'}`}
              style={{
                width: 20, height: 20,
                left: segment.x * 20, top: segment.y * 20,
                border: '2px solid #000'
              }}
            />
          )
        })}

        {/* Overlays */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20 border-4 border-fuchsia-600 m-4">
            <h2 className="text-fuchsia-500 text-6xl font-bold mb-2 glitch" data-text="FATAL_ERR">FATAL_ERR</h2>
            <p className="text-cyan-400 text-3xl mb-8">DATA LOST: {score}</p>
            <button 
              onClick={resetGame}
              className="bg-cyan-500 text-black px-6 py-2 text-3xl font-bold hover:bg-fuchsia-500 hover:text-white transition-colors uppercase shadow-[4px_4px_0px_#FF00FF]"
            >
              REBOOT_SEQ
            </button>
          </div>
        )}

        {isPaused && !gameOver && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">
            <h2 className="text-cyan-400 text-6xl font-bold glitch" data-text="SYSTEM_HALT">SYSTEM_HALT</h2>
          </div>
        )}
      </div>
      <div className="w-full bg-cyan-500 text-black text-center mt-6 p-2 font-bold text-xl shadow-[4px_4px_0px_#FF00FF]">
        INPUT: [W,A,S,D] | INTERRUPT: [SPACE]
      </div>
    </div>
  );
}
