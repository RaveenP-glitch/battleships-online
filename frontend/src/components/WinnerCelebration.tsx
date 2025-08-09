'use client';

import { useEffect, useState } from 'react';
import { Trophy, Star, Crown, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface WinnerCelebrationProps {
  winner: {
    id: string;
    name: string;
  };
  currentPlayer: {
    playerId: string;
    playerName: string;
  };
  gameStats?: {
    totalMoves: number;
    hitRate: number;
    duration: string;
  };
}

export default function WinnerCelebration({ 
  winner, 
  currentPlayer, 
  gameStats 
}: WinnerCelebrationProps) {
  const [animate, setAnimate] = useState(false);
  const isWinner = winner.id === currentPlayer.playerId;

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className={`absolute transition-all duration-1000 ${animate ? 'opacity-100' : 'opacity-0'}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animation: animate ? 'float 3s ease-in-out infinite' : 'none',
            }}
          >
            {i % 4 === 0 && <Star className="h-4 w-4 text-yellow-400" />}
            {i % 4 === 1 && <Sparkles className="h-3 w-3 text-blue-400" />}
            {i % 4 === 2 && <div className="w-2 h-2 bg-purple-400 rounded-full" />}
            {i % 4 === 3 && <div className="w-3 h-3 bg-pink-400 rotate-45" />}
          </div>
        ))}
      </div>

      {/* Main Celebration Card */}
      <div 
        className={`bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md w-full text-center border border-white/20 shadow-2xl transform transition-all duration-500 ${
          animate ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
        }`}
      >
        {/* Winner Icon */}
        <div className={`mx-auto mb-6 p-4 rounded-full ${isWinner ? 'bg-yellow-500/20' : 'bg-red-500/20'}`}>
          {isWinner ? (
            <Trophy className="h-16 w-16 text-yellow-400 mx-auto" />
          ) : (
            <Crown className="h-16 w-16 text-red-400 mx-auto" />
          )}
        </div>

        {/* Winner Announcement */}
        <div className="mb-6">
          {isWinner ? (
            <>
              <h1 className="text-4xl font-bold text-yellow-400 mb-2">🎉 VICTORY! 🎉</h1>
              <p className="text-xl text-white font-semibold mb-2">Congratulations!</p>
              <p className="text-ocean-200">
                You've successfully sunk all enemy ships and won the battle!
              </p>
            </>
          ) : (
            <>
              <h1 className="text-4xl font-bold text-red-400 mb-2">💥 DEFEAT 💥</h1>
              <p className="text-xl text-white font-semibold mb-2">Game Over</p>
              <p className="text-ocean-200">
                <span className="text-yellow-400 font-semibold">{winner.name}</span> has sunk all your ships!
              </p>
            </>
          )}
        </div>

        {/* Game Stats */}
        {gameStats && (
          <div className="bg-white/5 rounded-lg p-4 mb-6">
            <h3 className="text-white font-semibold mb-3">Battle Statistics</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-ocean-200">Total Moves</div>
                <div className="text-white font-semibold">{gameStats.totalMoves}</div>
              </div>
              <div>
                <div className="text-ocean-200">Hit Rate</div>
                <div className="text-white font-semibold">{gameStats.hitRate}%</div>
              </div>
              <div className="col-span-2">
                <div className="text-ocean-200">Battle Duration</div>
                <div className="text-white font-semibold">{gameStats.duration}</div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href="/game/create"
            className="block w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Play Again
          </Link>
          <Link
            href="/"
            className="block w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 border border-white/20"
          >
            Back to Home
          </Link>
        </div>
      </div>

      {/* Custom CSS for floating animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(90deg); }
          50% { transform: translateY(0px) rotate(180deg); }
          75% { transform: translateY(-5px) rotate(270deg); }
        }
      `}</style>
    </div>
  );
} 