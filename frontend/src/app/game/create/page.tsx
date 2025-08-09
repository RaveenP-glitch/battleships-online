'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Play } from 'lucide-react';
import Link from 'next/link';

export default function CreateGamePage() {
  const [playerName, setPlayerName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleCreateGame = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!playerName.trim()) {
      setError('Player name is required');
      return;
    }

    setIsCreating(true);
    setError('');

    try {
      const response = await fetch('/api/v1/games', {
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
          playerId: data.data.player1.id,
          playerName: data.data.player1.name,
        }));
        
        // Redirect to game page
        router.push(`/game/${data.data.id}`);
      } else {
        setError(data.error?.message || 'Failed to create game');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Create game error:', err);
    } finally {
      setIsCreating(false);
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
              <div className="bg-primary-500 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Play className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Create New Game</h1>
              <p className="text-ocean-100">
                Start a new battleships game and invite a friend to join
              </p>
            </div>

            <form onSubmit={handleCreateGame} className="space-y-6">
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-100">
                  {error}
                </div>
              )}

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
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    maxLength={20}
                    disabled={isCreating}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isCreating || !playerName.trim()}
                className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                {isCreating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Game...
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5 mr-2" />
                    Create Game
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-ocean-200 text-sm">
                Once created, share the game link with your opponent to start playing!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 