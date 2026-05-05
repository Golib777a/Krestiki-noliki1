import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Circle, RotateCcw, Trophy, User } from 'lucide-react';

type Player = 'X' | 'O';
type SquareValue = Player | null;

const calculateWinner = (squares: SquareValue[]): { winner: SquareValue; line: number[] | null } => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] };
    }
  }
  return { winner: null, line: null };
};

export default function App() {
  const [squares, setSquares] = useState<SquareValue[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState<boolean>(true);
  const [scores, setScores] = useState({ X: 0, O: 0 });

  const { winner, line } = calculateWinner(squares);
  const isDraw = !winner && squares.every((square) => square !== null);
  const currentPlayer = xIsNext ? 'X' : 'O';

  const handleClick = (i: number) => {
    if (winner || squares[i]) return;
    const nextSquares = [...squares];
    nextSquares[i] = currentPlayer;
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  };

  const resetGame = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  useEffect(() => {
    if (winner) {
      setScores((prev) => ({ ...prev, [winner]: prev[winner as Player] + 1 }));
    }
  }, [winner]);

  return (
    <div className="min-h-screen bg-[#F0F0F0] text-black font-sans selection:bg-black selection:text-white flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b-2 border-black">
          <div className="flex flex-col">
            <h1 className="text-4xl font-display uppercase tracking-tighter">Крестики Нолики</h1>
            <p className="text-xs font-bold uppercase opacity-50">Offline PWA Версия</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={resetGame}
            className="p-3 bg-black text-white hover:bg-[#333] transition-colors"
          >
            <RotateCcw size={20} />
          </motion.button>
        </div>

        {/* Score Board */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className={`p-4 border-2 border-black flex items-center gap-3 ${xIsNext && !winner && !isDraw ? 'bg-black text-white' : 'bg-white'}`}>
            <X size={24} strokeWidth={3} />
            <div>
              <p className="text-[10px] font-bold uppercase opacity-50">Игрок X</p>
              <p className="text-2xl font-black">{scores.X}</p>
            </div>
          </div>
          <div className={`p-4 border-2 border-black flex items-center gap-3 ${!xIsNext && !winner && !isDraw ? 'bg-black text-white' : 'bg-white'}`}>
            <Circle size={24} strokeWidth={3} />
            <div>
              <p className="text-[10px] font-bold uppercase opacity-50">Игрок O</p>
              <p className="text-2xl font-black">{scores.O}</p>
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="h-12 flex items-center justify-center mb-4 overflow-hidden">
          <AnimatePresence mode="wait">
            {winner ? (
              <motion.div
                key="winner"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="flex items-center gap-2"
              >
                <Trophy className="text-yellow-500" />
                <span className="text-xl font-black uppercase">Победитель: Игрок {winner}</span>
              </motion.div>
            ) : isDraw ? (
              <motion.div
                key="draw"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="text-xl font-black uppercase"
              >
                Ничья!
              </motion.div>
            ) : (
              <motion.div
                key="turn"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="flex items-center gap-2"
              >
                <User size={20} className="opacity-50" />
                <span className="text-xl font-black uppercase">Ход: Игрок {currentPlayer}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-3 gap-2 bg-black border-2 border-black">
          {squares.map((square, i) => {
            const isWinningSquare = line?.includes(i);
            return (
              <motion.button
                key={i}
                whileHover={!square && !winner ? { backgroundColor: '#F9F9F9' } : {}}
                whileTap={!square && !winner ? { scale: 0.95 } : {}}
                onClick={() => handleClick(i)}
                animate={isWinningSquare ? { 
                  backgroundColor: ['#FFFFFF', '#FEF3C7', '#FFFFFF'],
                  transition: { repeat: Infinity, duration: 1.5 }
                } : {}}
                className={`h-24 sm:h-32 bg-white flex items-center justify-center relative border border-transparent ${
                  isWinningSquare ? 'z-10' : ''
                }`}
              >
                <AnimatePresence>
                  {square === 'X' && (
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0, rotate: -45 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      className="text-black"
                    >
                      <X size={48} strokeWidth={3} />
                    </motion.div>
                  )}
                  {square === 'O' && (
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-black"
                    >
                      <Circle size={44} strokeWidth={3} />
                    </motion.div>
                  )}
                </AnimatePresence>
                {/* Visual number for accessibility/style */}
                <span className="absolute top-1 left-1 text-[8px] font-bold opacity-10">0{i + 1}</span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Footer Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-center"
      >
        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30">
          Крестики-Нолики &bull; Создано в AI Studio &bull; 2026
        </p>
      </motion.div>
    </div>
  );
}
