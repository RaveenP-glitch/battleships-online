import Link from 'next/link';
import { Anchor, ArrowLeft, Play, Target, Ship, Grid3X3 } from 'lucide-react';

export default function RulesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-400 via-ocean-500 to-ocean-600">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center items-center mb-6">
            <Anchor className="h-16 w-16 text-white mr-4" />
            <h1 className="text-6xl font-bold text-white">
              Game Rules
            </h1>
          </div>
          <p className="text-xl text-ocean-100 max-w-3xl mx-auto">
            Learn how to play Battleships Online and master the art of naval warfare. 
            Watch the tutorial video and read the detailed rules below.
          </p>
        </div>

        {/* Back to Home Button */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors duration-200 backdrop-blur-sm"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Video Tutorial Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 mb-12">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center mb-4">
              <Play className="h-8 w-8 text-ocean-100 mr-3" />
              <h2 className="text-3xl font-bold text-white">Video Tutorial</h2>
            </div>
            <p className="text-ocean-100">
              Watch this comprehensive guide to learn how to play Battleships like a pro!
            </p>
          </div>
          
          {/* YouTube Video Embed */}
          <div className="relative w-full max-w-4xl mx-auto">
            <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg shadow-2xl">
              <iframe
                src="https://www.youtube.com/embed/RY4nAyRgkLo"
                title="How to Play Battleships - Tutorial"
                className="absolute top-0 left-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>

        {/* Rules Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Game Setup */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
            <div className="flex items-center mb-6">
              <Grid3X3 className="h-8 w-8 text-ocean-100 mr-3" />
              <h3 className="text-2xl font-bold text-white">Game Setup</h3>
            </div>
            <div className="space-y-4 text-ocean-100">
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Grid</h4>
                <p>Each player has a 10×10 grid labeled A-J (rows) and 1-10 (columns).</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Fleet Composition</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>1 Battleship:</strong> 4 cells long</li>
                  <li><strong>2 Destroyers:</strong> 3 cells long each</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Ship Placement Rules</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Ships can be placed horizontally or vertically</li>
                  <li>Ships cannot overlap or touch each other</li>
                  <li>All ships must fit entirely within the grid</li>
                  <li>Ships cannot be placed diagonally</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Gameplay */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
            <div className="flex items-center mb-6">
              <Target className="h-8 w-8 text-ocean-100 mr-3" />
              <h3 className="text-2xl font-bold text-white">Gameplay</h3>
            </div>
            <div className="space-y-4 text-ocean-100">
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Turn Order</h4>
                <p>Players alternate turns. The game randomly selects who goes first.</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Making an Attack</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Click on any cell in your opponent's grid</li>
                  <li>You cannot attack the same cell twice</li>
                  <li>Wait for the result before making your next move</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Attack Results</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>💧 Miss:</strong> Your shot hit empty water</li>
                  <li><strong>💥 Hit:</strong> Your shot hit an enemy ship</li>
                  <li><strong>💀 Sunk:</strong> Your shot destroyed an entire ship</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Winning */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
            <div className="flex items-center mb-6">
              <Ship className="h-8 w-8 text-ocean-100 mr-3" />
              <h3 className="text-2xl font-bold text-white">Victory Conditions</h3>
            </div>
            <div className="space-y-4 text-ocean-100">
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">How to Win</h4>
                <p>The first player to sink all of their opponent's ships wins the game!</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Ship Status</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>A ship is <strong>sunk</strong> when all of its cells have been hit</li>
                  <li>The game automatically detects when a ship is completely destroyed</li>
                  <li>You'll see a special animation when you sink a ship</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Game End</h4>
                <p>When all enemy ships are sunk, the game ends with a victory celebration!</p>
              </div>
            </div>
          </div>

          {/* Strategy Tips */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
            <div className="flex items-center mb-6">
              <Target className="h-8 w-8 text-ocean-100 mr-3" />
              <h3 className="text-2xl font-bold text-white">Strategy Tips</h3>
            </div>
            <div className="space-y-4 text-ocean-100">
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Ship Placement</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Avoid predictable patterns (edges, corners, clusters)</li>
                  <li>Mix horizontal and vertical orientations</li>
                  <li>Leave space between ships to confuse your opponent</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Attacking Strategy</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Start with a systematic search pattern</li>
                  <li>When you get a hit, attack adjacent cells</li>
                  <li>Remember ship sizes to avoid wasting shots</li>
                  <li>Keep track of what you've already tried</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Reference */}
        <div className="mt-12 bg-white/10 backdrop-blur-sm rounded-lg p-8">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Quick Reference</h3>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl mb-2">🚢</div>
              <h4 className="text-lg font-semibold text-white mb-2">Fleet</h4>
              <p className="text-ocean-100 text-sm">1 Battleship (4) + 2 Destroyers (3)</p>
            </div>
            <div>
              <div className="text-3xl mb-2">🎯</div>
              <h4 className="text-lg font-semibold text-white mb-2">Objective</h4>
              <p className="text-ocean-100 text-sm">Sink all enemy ships first</p>
            </div>
            <div>
              <div className="text-3xl mb-2">⚔️</div>
              <h4 className="text-lg font-semibold text-white mb-2">Turns</h4>
              <p className="text-ocean-100 text-sm">Alternate attacks until victory</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center mt-12 space-y-4">
          <div className="space-x-4">
            <Link
              href="/game/create"
              className="inline-flex items-center px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg"
            >
              <Play className="h-5 w-5 mr-2" />
              Start Playing Now
            </Link>
            <Link
              href="/"
              className="inline-flex items-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors duration-200 backdrop-blur-sm"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
          </div>
          
          <div className="text-ocean-100">
            <p>Ready to test your naval strategy skills?</p>
          </div>
        </div>
      </div>
    </div>
  );
} 