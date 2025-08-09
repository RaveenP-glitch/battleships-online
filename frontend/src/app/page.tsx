import Link from 'next/link';
import { Anchor, Play, Trophy, Users } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-400 via-ocean-500 to-ocean-600">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center items-center mb-6">
            <Anchor className="h-16 w-16 text-white mr-4" />
            <h1 className="text-6xl font-bold text-white">
              Battleships Online
            </h1>
          </div>
          <p className="text-xl text-ocean-100 max-w-2xl mx-auto">
            Challenge your friends in the classic naval strategy game. Place your ships, 
            take turns attacking, and sink your opponent's fleet to victory!
          </p>
        </div>

        {/* Game Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
            <Users className="h-12 w-12 text-ocean-100 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">2-Player</h3>
            <p className="text-ocean-100">
              Real-time multiplayer battles with friends or random opponents
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
            <Play className="h-12 w-12 text-ocean-100 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Turn-Based</h3>
            <p className="text-ocean-100">
              Strategic gameplay where every move counts. Plan your attacks carefully!
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
            <Trophy className="h-12 w-12 text-ocean-100 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Classic Rules</h3>
            <p className="text-ocean-100">
              Traditional battleships with 1 Battleship (4 cells) and 2 Destroyers (3 cells)
            </p>
          </div>
        </div>

        {/* Game Actions */}
        <div className="text-center space-y-6">
          <div className="space-x-4">
            <Link
              href="/game/create"
              className="inline-flex items-center px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg"
            >
              <Play className="h-5 w-5 mr-2" />
              Create New Game
            </Link>
            <Link
              href="/game/join"
              className="inline-flex items-center px-8 py-4 bg-secondary-600 hover:bg-secondary-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg"
            >
              <Users className="h-5 w-5 mr-2" />
              Join Game
            </Link>
          </div>
          
          <div className="text-ocean-100">
            <p>
              Need help? Check out the{' '}
              <Link href="/rules" className="text-white underline hover:no-underline">
                game rules
              </Link>
            </p>
          </div>
        </div>

        {/* Game Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-white/5 backdrop-blur-sm rounded p-4">
            <div className="text-2xl font-bold text-white">10x10</div>
            <div className="text-ocean-200 text-sm">Grid Size</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded p-4">
            <div className="text-2xl font-bold text-white">3</div>
            <div className="text-ocean-200 text-sm">Ships per Player</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded p-4">
            <div className="text-2xl font-bold text-white">100</div>
            <div className="text-ocean-200 text-sm">Cells to Attack</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded p-4">
            <div className="text-2xl font-bold text-white">2</div>
            <div className="text-ocean-200 text-sm">Players Max</div>
          </div>
        </div>
      </div>
    </div>
  );
} 