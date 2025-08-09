'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Users, Hash } from 'lucide-react';
import Link from 'next/link';

export default function JoinGamePage() {
  const [playerName, setPlayerName] = useState('');
  const [gameId, setGameId] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleJoinGame = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!playerName.trim()) {
      setError('Player name is required');
      return;
    }

    if (!gameId.trim()) {
      setError('Game ID is required');
      return;
    }

    setIsJoining(true);
    setError('');

    try {
      const response = await fetch(`/api/v1/games/${gameId.trim()}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerName: playerName.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        // Store game info in localStorage for the game page
        localStorage.setItem('currentGame', JSON.stringify({
          gameId: data.data.id,
          playerId: data.data.player2.id,
          playerName: data.data.player2.name,
        }));
        
        // Redirect to game page
        router.push(`/game/${data.data.id}`);
      } else {
        setError(data.error?.message || 'Failed to join game');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Join game error:', err);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-400 via-ocean-500 to-ocean-600">
      <div className="container mx-auto px-4 py-16">
        {/* Back Button */}
        <Link 
          href="/" 
          className="inline-flex items-center text-white hover:text-ocean-200 mb-8 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </Link>

        {/* Main Content */}
        <div className="max-w-md mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 shadow-xl">
            <div className="text-center mb-8">
              <div className="bg-secondary-500 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Join Game</h1>
              <p className="text-ocean-100">
                Enter the game ID and your name to join an existing game
              </p>
            </div>

            <form onSubmit={handleJoinGame} className="space-y-6">
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-100">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="gameId" className="block text-sm font-medium text-white mb-2">
                  Game ID
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="gameId"
                    type="text"
                    value={gameId}
                    onChange={(e) => setGameId(e.target.value)}
                    placeholder="Enter game ID"
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                    disabled={isJoining}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="playerName" className="block text-sm font-medium text-white mb-2">
                  Your Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="playerName"
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                    maxLength={20}
                    disabled={isJoining}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isJoining || !playerName.trim() || !gameId.trim()}
                className="w-full bg-secondary-600 hover:bg-secondary-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                {isJoining ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Joining Game...
                  </>
                ) : (
                  <>
                    <Users className="h-5 w-5 mr-2" />
                    Join Game
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 p-4 bg-white/5 rounded-lg">
              <h3 className="text-white font-semibold mb-2">How to get the Game ID:</h3>
              <ul className="text-ocean-200 text-sm space-y-1">
                <li>• Ask your friend to share the game link</li>
                <li>• The Game ID is in the URL after /game/</li>
                <li>• It looks like: cmdycmp2z0002usas7yafy4i9</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 