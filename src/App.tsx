import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Circle, RotateCcw, Cpu, ShieldAlert, Terminal, Zap } from 'lucide-react';

type Player = 'X' | 'O';
type SquareValue = Player | null;

const calculateWinner = (squares: SquareValue[]): { winner: SquareValue; line: number[] | null } => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: null };
};

export default function App() {
  const [squares, setSquares] = useState<SquareValue[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const [isGameEnded, setIsGameEnded] = useState(false);

  const { winner, line } = calculateWinner(squares);
  const isDraw = !winner && squares.every((s) => s !== null);
  const currentPlayer = xIsNext ? 'X' : 'O';

  useEffect(() => {
    if ((winner || isDraw) && !isGameEnded) {
      setIsGameEnded(true);
      if (winner) {
        setScores(prev => ({ ...prev, [winner]: prev[winner as Player] + 1 }));
      }
    }
  }, [winner, isDraw, isGameEnded]);

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
    setIsGameEnded(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-6 selection:bg-[#00F0FF] selection:text-black font-mono overflow-hidden relative">
      {/* Background Decorative Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#00F0FF 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      
      {/* Main Tool Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[420px] bg-[#151619] border border-[#2D2F36] rounded-2xl shadow-2xl relative z-10 p-1 flex flex-col"
      >
        {/* Hardware Frame Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2D2F36]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse" />
            <h1 className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#00F0FF]">System Active</h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-[8px] font-bold opacity-30 uppercase tracking-widest flex items-center gap-1">
               <Cpu size={10} />
               v2.0.4-stable
             </div>
             <motion.button
               whileTap={{ rotate: -180 }}
               onClick={resetGame}
               className="p-1 px-2 border border-[#2D2F36] rounded text-[#8E9299] hover:text-[#00F0FF] hover:border-[#00F0FF] transition-all flex items-center gap-1 text-[10px] uppercase font-bold"
             >
               <RotateCcw size={12} />
               Reset
             </motion.button>
          </div>
        </div>

        {/* Status Area */}
        <div className="p-6 bg-[#1A1B1E] m-1 rounded-xl">
          <div className="flex justify-between items-end mb-6">
            <div className="space-y-1">
              <span className="text-[9px] uppercase tracking-widest text-[#8E9299]">Current Session</span>
              <div className="flex items-center gap-2 text-2xl font-black italic">
                {winner ? (
                  <span className="text-[#00F0FF] animate-pulse uppercase">Unit {winner} Won</span>
                ) : isDraw ? (
                  <span className="text-[#8E9299] uppercase">Stalemate</span>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="opacity-50 tracking-tighter">PLAYER_{currentPlayer}</span>
                    <Zap size={18} className="text-[#00F0FF]" fill="#00F0FF" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-right">
                <p className="text-[9px] uppercase tracking-tighter text-[#8E9299]">X_SCORE</p>
                <p className="text-xl font-bold font-mono tracking-tighter">{scores.X.toString().padStart(3, '0')}</p>
              </div>
              <div className="text-right border-l border-[#2D2F36] pl-4">
                <p className="text-[9px] uppercase tracking-tighter text-[#8E9299]">O_SCORE</p>
                <p className="text-xl font-bold font-mono tracking-tighter">{scores.O.toString().padStart(3, '0')}</p>
              </div>
            </div>
          </div>

          {/* Grid Container */}
          <div className="relative group">
            {/* Visual Grid Lines Overlay */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none z-10">
              <div className="border-r border-[#2D2F36]" />
              <div className="border-r border-[#2D2F36]" />
              <div />
              <div className="border-t border-[#2D2F36] col-span-3" />
              <div className="border-t border-[#2D2F36] col-span-3" />
            </div>

            <div className="grid grid-cols-3 aspect-square border border-[#2D2F36] bg-[#111113] overflow-hidden rounded-lg">
              {squares.map((square, i) => {
                const isWinningSquare = line?.includes(i);
                return (
                  <button
                    key={i}
                    onClick={() => handleClick(i)}
                    className={`relative flex items-center justify-center transition-all outline-none ${
                       !square && !winner ? 'hover:bg-[#1A1B1E]' : ''
                    }`}
                  >
                    <AnimatePresence mode="wait">
                      {square === 'X' && (
                        <motion.div
                          key="x"
                          initial={{ pathLength: 0, opacity: 0, scale: 0.8 }}
                          animate={{ pathLength: 1, opacity: 1, scale: 1 }}
                          className={isWinningSquare ? 'text-[#00F0FF] drop-shadow-[0_0_8px_#00F0FF]' : 'text-white opacity-80'}
                        >
                          <X size={48} strokeWidth={2.5} />
                        </motion.div>
                      )}
                      {square === 'O' && (
                        <motion.div
                          key="o"
                          initial={{ pathLength: 0, opacity: 0, scale: 0.8 }}
                          animate={{ pathLength: 1, opacity: 1, scale: 1 }}
                          className={isWinningSquare ? 'text-[#00F0FF] drop-shadow-[0_0_8px_#00F0FF]' : 'text-white opacity-80'}
                        >
                          <Circle size={42} strokeWidth={2.5} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {/* Corner accents for the button */}
                    <div className="absolute top-0 left-0 w-1 h-1 bg-[#2D2F36]" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Technical Rail */}
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex gap-1">
             {[...Array(5)].map((_, i) => (
               <div key={i} className="w-4 h-1 bg-[#2D2F36] rounded-full" />
             ))}
          </div>
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-1 text-[9px] font-bold text-[#8E9299] uppercase tracking-widest">
               <ShieldAlert size={12} className="text-yellow-600" />
               No Errors
             </div>
             <div className="w-[1px] h-3 bg-[#2D2F36]" />
             <div className="flex items-center gap-1 text-[9px] font-bold text-[#8E9299] uppercase tracking-widest">
                <Terminal size={12} strokeWidth={3} />
                Terminal_Ready
             </div>
          </div>
        </div>
      </motion.div>

      {/* Decorative Labels */}
      <div className="absolute top-10 right-10 text-right opacity-10 pointer-events-none Select-none">
        <h3 className="text-5xl font-black tracking-tighter uppercase leading-none">Control<br/>Interface</h3>
        <p className="text-[10px] font-bold tracking-[0.4em] mt-2">PROPERTY_OF_NEURAL_SYS</p>
      </div>

      <div className="absolute bottom-10 left-10 opacity-10 pointer-events-none select-none">
        <div className="flex items-center gap-4">
          <div className="w-12 h-[1px] bg-white" />
          <p className="text-[10px] font-bold tracking-[0.4em]">DEPLOYMENT_STATION_A</p>
        </div>
      </div>
    </div>
  );
}
