import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-ocean">
      {/* Navigation Header */}
      <nav className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-display font-bold text-white">
              🚢 Battleships Online
            </h1>
            <div className="space-x-4">
              <Link href="/game/create" className="btn-ocean">
                Create Game
              </Link>
              <Link href="/game/join" className="btn-navy">
                Join Game
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-display font-bold text-white mb-6 animate-fade-in">
            Naval Strategy Game
          </h2>
          <p className="text-xl text-ocean-100 mb-8 max-w-2xl mx-auto animate-slide-in">
            Engage in epic turn-based naval battles. Place your ships strategically, 
            attack your opponent, and sink their entire fleet to claim victory!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-in">
            <Link href="/game/create" className="btn-ocean text-lg px-8 py-4">
              🎮 Start New Battle
            </Link>
            <Link href="/game/join" className="btn-navy text-lg px-8 py-4">
              ⚓ Join Existing Game
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="card-ocean text-center animate-fade-in">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-display font-bold mb-3 text-navy-800">
              Strategic Gameplay
            </h3>
            <p className="text-navy-600">
              Plan your attacks carefully and outmaneuver your opponent in this classic naval strategy game.
            </p>
          </div>
          
          <div className="card-ocean text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-display font-bold mb-3 text-navy-800">
              Real-time Multiplayer
            </h3>
            <p className="text-navy-600">
              Challenge friends or players worldwide with instant updates and seamless multiplayer experience.
            </p>
          </div>
          
          <div className="card-ocean text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-display font-bold mb-3 text-navy-800">
              Epic Battles
            </h3>
            <p className="text-navy-600">
              Experience thrilling naval combat with beautiful animations and satisfying victory celebrations.
            </p>
          </div>
        </div>

        {/* Demo Game Board */}
        <div className="text-center mb-16">
          <h3 className="text-3xl font-display font-bold text-white mb-8">
            Interactive Battle Grid
          </h3>
          <div className="max-w-md mx-auto">
            <div className="battleship-grid">
              {Array.from({ length: 100 }, (_, i) => {
                const row = Math.floor(i / 10);
                const col = i % 10;
                let cellClass = 'battleship-cell water';
                let content = '';
                
                // Demo ship placements and hits
                if ((row === 2 && col >= 2 && col <= 5) || 
                    (row >= 5 && row <= 7 && col === 3) ||
                    (row === 8 && col >= 6 && col <= 8)) {
                  cellClass = 'battleship-cell ship';
                  content = '🚢';
                }
                
                // Demo hits
                if ((row === 2 && col === 3) || (row === 6 && col === 3)) {
                  cellClass = 'battleship-cell hit';
                  content = '💥';
                }
                
                // Demo misses
                if ((row === 1 && col === 1) || (row === 4 && col === 7)) {
                  cellClass = 'battleship-cell miss';
                  content = '💧';
                }
                
                return (
                  <div key={i} className={cellClass}>
                    {content}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Game Rules */}
        <div className="card-ocean max-w-4xl mx-auto">
          <h3 className="text-2xl font-display font-bold mb-6 text-navy-800 text-center">
            How to Play
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-bold mb-3 text-navy-700">🚢 Ship Placement</h4>
              <ul className="space-y-2 text-navy-600">
                <li>• Place 1 Battleship (4 cells) and 2 Destroyers (3 cells each)</li>
                <li>• Ships can be placed horizontally or vertically</li>
                <li>• Ships cannot overlap or touch each other</li>
                <li>• All ships must fit within the 10×10 grid</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-3 text-navy-700">⚔️ Battle Phase</h4>
              <ul className="space-y-2 text-navy-600">
                <li>• Take turns attacking opponent's grid coordinates</li>
                <li>• 💥 Hit - You struck an enemy ship!</li>
                <li>• 💧 Miss - Your shot hit empty water</li>
                <li>• 💀 Sunk - You destroyed an entire ship!</li>
                <li>• First to sink all enemy ships wins!</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-navy-900 text-ocean-100 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-4">
            Built with ❤️ using Next.js, TypeScript, and TailwindCSS
          </p>
          <div className="flex justify-center space-x-6 text-sm">
            <a href="#" className="hover:text-ocean-300 transition-colors">
              Game Rules
            </a>
            <a href="#" className="hover:text-ocean-300 transition-colors">
              About
            </a>
            <a href="#" className="hover:text-ocean-300 transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>

      {/* Loading Spinner Demo (hidden by default) */}
      <div className="fixed bottom-4 right-4 opacity-0 hover:opacity-100 transition-opacity">
        <div className="loading-spinner w-8 h-8"></div>
      </div>
    </div>
  );
}
