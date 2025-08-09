'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Copy, Share, Users } from 'lucide-react';
import Link from 'next/link';
import ShipPlacement from '@/components/ShipPlacement';
import BattleInterface from '@/components/BattleInterface';
import GameNotifications, { useGameNotifications } from '@/components/GameNotifications';
import WinnerCelebration from '@/components/WinnerCelebration';

interface GameData {
  id: string;
  status: string;
  currentTurn: string | null;
  winner: string | null;
  player1: {
    id: string;
    name: string;
    ships: Array<{
      id?: string;
      type: string;
      startX: number;
      startY: number;
      direction: string;
      sunk: boolean;
    }>;
    grid: any;
  };
  player2?: {
    id: string;
    name: string;
    ships: Array<{
      id?: string;
      type: string;
      startX: number;
      startY: number;
      direction: string;
      sunk: boolean;
    }>;
    grid: any;
  };
  moves: Array<{
    id?: string;
    playerId: string;
    x: number;
    y: number;
    result: string;
  }>;
}

export default function GamePage() {
  const { id } = useParams();
  const router = useRouter();
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPlayer, setCurrentPlayer] = useState<any>(null);
  const [isSubmittingShips, setIsSubmittingShips] = useState(false);
  const [isAttacking, setIsAttacking] = useState(false);
  const [previousGameData, setPreviousGameData] = useState<GameData | null>(null);
  const [showWinnerCelebration, setShowWinnerCelebration] = useState(false);
  const { notifications, addNotification, removeNotification } = useGameNotifications();

  useEffect(() => {
    // Get current player info from localStorage
    const savedGame = localStorage.getItem('currentGame');
    if (savedGame) {
      const gameInfo = JSON.parse(savedGame);
      if (gameInfo.gameId === id) {
        setCurrentPlayer(gameInfo);
      }
    }

    fetchGameData();
    // Set up polling for real-time updates
    const interval = setInterval(fetchGameData, 2000);
    return () => clearInterval(interval);
  }, [id]);

  const fetchGameData = async () => {
    try {
      const response = await fetch(`/api/v1/games/${id}`);
      const data = await response.json();

      if (data.success) {
        const newGameData = data.data;
        
        // Check for ship destruction events
        if (previousGameData && currentPlayer) {
          checkForShipDestruction(previousGameData, newGameData);
        }
        
        // Check for game completion
        if (newGameData.status === 'COMPLETED' && !showWinnerCelebration) {
          setShowWinnerCelebration(true);
          
          const isWinner = newGameData.winner === currentPlayer?.playerId;
          addNotification({
            type: isWinner ? 'game_won' : 'game_lost',
            title: isWinner ? '🎉 Victory!' : '💥 Defeat!',
            message: isWinner 
              ? 'You have won the battle!' 
              : `${getWinnerName(newGameData)} has won the battle!`,
            persistent: true
          });
        }
        
        setPreviousGameData(gameData);
        setGameData(newGameData);
        setError('');
      } else {
        setError(data.error?.message || 'Failed to load game');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
      console.error('Fetch game error:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkForShipDestruction = (prevData: GameData, newData: GameData) => {
    if (!currentPlayer) return;

    const isPlayer1 = currentPlayer.playerId === newData.player1.id;
    const myPrevShips = isPlayer1 ? prevData.player1.ships : prevData.player2?.ships || [];
    const myNewShips = isPlayer1 ? newData.player1.ships : newData.player2?.ships || [];
    const opponentPrevShips = isPlayer1 ? prevData.player2?.ships || [] : prevData.player1.ships;
    const opponentNewShips = isPlayer1 ? newData.player2?.ships || [] : newData.player1.ships;

    // Check if I lost a ship
    const newlyLostShips = myNewShips.filter(ship => 
      ship.sunk && !myPrevShips.find(prevShip => prevShip.id === ship.id && prevShip.sunk)
    );
    
    newlyLostShips.forEach(ship => {
      addNotification({
        type: 'ship_lost',
        title: '💥 Ship Lost!',
        message: `Your ${ship.type.toLowerCase()} has been destroyed!`,
        duration: 4000
      });
    });

    // Check if I sunk an opponent's ship
    const newlySunkShips = opponentNewShips.filter(ship => 
      ship.sunk && !opponentPrevShips.find(prevShip => prevShip.id === ship.id && prevShip.sunk)
    );
    
    newlySunkShips.forEach(ship => {
      addNotification({
        type: 'ship_sunk',
        title: '🎯 Direct Hit!',
        message: `You sunk the enemy ${ship.type.toLowerCase()}!`,
        duration: 4000
      });
    });
  };

  const getWinnerName = (gameData: GameData) => {
    return gameData.winner === gameData.player1.id ? gameData.player1.name : gameData.player2?.name;
  };

  const calculateGameStats = () => {
    if (!gameData || !currentPlayer) return undefined;

    const myMoves = gameData.moves.filter(move => move.playerId === currentPlayer.playerId);
    const hits = myMoves.filter(move => move.result === 'HIT' || move.result === 'SUNK').length;
    const hitRate = myMoves.length > 0 ? Math.round((hits / myMoves.length) * 100) : 0;

    return {
      totalMoves: myMoves.length,
      hitRate: hitRate,
      duration: 'N/A' // Could calculate from game creation time
    };
  };

  const copyGameId = () => {
    navigator.clipboard.writeText(id as string);
    // Could add a toast notification here
  };

  const shareGameLink = () => {
    const gameUrl = `${window.location.origin}/game/${id}`;
    navigator.clipboard.writeText(gameUrl);
    // Could add a toast notification here
  };

  const handleShipsPlaced = async (ships: any[]) => {
    if (!currentPlayer) return;
    
    setIsSubmittingShips(true);
    try {
      const response = await fetch(`/api/v1/games/${id}/ships`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerId: currentPlayer.playerId,
          ships: ships,
        }),
      });

      const data = await response.json();
      if (data.success) {
        // Refresh game data
        await fetchGameData();
      } else {
        setError(data.error?.message || 'Failed to place ships');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Ship placement error:', err);
    } finally {
      setIsSubmittingShips(false);
    }
  };

  const handleAttack = async (x: number, y: number) => {
    if (!currentPlayer) return;
    
    setIsAttacking(true);
    try {
      const response = await fetch(`/api/v1/games/${id}/attack`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerId: currentPlayer.playerId,
          x,
          y,
        }),
      });

      const data = await response.json();
      if (data.success) {
        // Show immediate attack result
        const result = data.data.result;
        const sunkShip = data.data.sunkShip;
        
        if (result === 'HIT' || result === 'SUNK') {
          addNotification({
            type: 'attack_result',
            title: '🎯 Hit!',
            message: sunkShip ? 'Direct hit! Enemy ship destroyed!' : 'Direct hit on enemy vessel!',
            duration: 3000
          });
        } else {
          addNotification({
            type: 'attack_result',
            title: '💧 Miss',
            message: 'Your attack missed the target.',
            duration: 2000
          });
        }
        
        // Refresh game data
        await fetchGameData();
      } else {
        setError(data.error?.message || 'Attack failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Attack error:', err);
    } finally {
      setIsAttacking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ocean-400 via-ocean-500 to-ocean-600 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading game...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ocean-400 via-ocean-500 to-ocean-600 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6 max-w-md">
            <h2 className="text-white text-xl font-bold mb-2">Error</h2>
            <p className="text-red-100 mb-4">{error}</p>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-400 via-ocean-500 to-ocean-600">
      {/* Game Notifications */}
      <GameNotifications 
        notifications={notifications} 
        onDismiss={removeNotification} 
      />

      {/* Winner Celebration Modal */}
      {showWinnerCelebration && gameData?.status === 'COMPLETED' && currentPlayer && (
        <WinnerCelebration
          winner={{
            id: gameData.winner || '',
            name: getWinnerName(gameData) || ''
          }}
          currentPlayer={currentPlayer}
          gameStats={calculateGameStats()}
        />
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-white hover:text-ocean-200 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>

          <div className="flex items-center space-x-2">
            <button
              onClick={copyGameId}
              className="flex items-center px-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors text-sm"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Game ID
            </button>
            <button
              onClick={shareGameLink}
              className="flex items-center px-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors text-sm"
            >
              <Share className="h-4 w-4 mr-2" />
              Share Link
            </button>
          </div>
        </div>

        {/* Game Info */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-white">Battleships Game</h1>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-ocean-200 text-sm">Game ID</div>
                <div className="text-white font-mono text-sm">{id}</div>
              </div>
              <div className="text-right">
                <div className="text-ocean-200 text-sm">Status</div>
                <div className="text-white font-semibold">{gameData?.status.replace('_', ' ')}</div>
              </div>
            </div>
          </div>

          {/* Players */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 bg-primary-500 rounded-full mr-2"></div>
                <span className="text-white font-semibold">Player 1</span>
                {currentPlayer?.playerId === gameData?.player1.id && (
                  <span className="ml-2 px-2 py-1 bg-primary-500 text-white text-xs rounded">You</span>
                )}
              </div>
              <p className="text-ocean-100">{gameData?.player1.name}</p>
              <p className="text-ocean-200 text-sm">Ships placed: {gameData?.player1.ships.length || 0}/3</p>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 bg-secondary-500 rounded-full mr-2"></div>
                <span className="text-white font-semibold">Player 2</span>
                {currentPlayer?.playerId === gameData?.player2?.id && (
                  <span className="ml-2 px-2 py-1 bg-secondary-500 text-white text-xs rounded">You</span>
                )}
              </div>
              {gameData?.player2 ? (
                <>
                  <p className="text-ocean-100">{gameData.player2.name}</p>
                  <p className="text-ocean-200 text-sm">Ships placed: {gameData.player2.ships.length || 0}/3</p>
                </>
              ) : (
                <p className="text-ocean-300 italic">Waiting for player...</p>
              )}
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-100 mb-6">
            {error}
          </div>
        )}

        {/* Dynamic Game Interface */}
        {gameData?.status === 'WAITING_FOR_PLAYER' && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-center">
              <Users className="h-12 w-12 text-ocean-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">Waiting for Second Player</h2>
              <p className="text-ocean-200 mb-4">
                Share the game ID or link with your friend to start playing!
              </p>
              <div className="bg-white/5 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-ocean-300 text-sm mb-2">Game ID:</p>
                <p className="text-white font-mono text-lg break-all">{id}</p>
              </div>
            </div>
          </div>
        )}

        {gameData?.status === 'PLACING_SHIPS' && currentPlayer && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            {/* Check if current player needs to place ships */}
            {(() => {
              const isPlayer1 = currentPlayer.playerId === gameData.player1.id;
              const myShips = isPlayer1 ? gameData.player1.ships : gameData.player2?.ships || [];
              const needsToPlaceShips = myShips.length === 0;
              
              if (needsToPlaceShips) {
                return (
                  <ShipPlacement 
                    onShipsPlaced={handleShipsPlaced}
                    isSubmitting={isSubmittingShips}
                  />
                );
              } else {
                return (
                  <div className="text-center">
                    <h2 className="text-xl font-semibold text-white mb-2">Ships Placed!</h2>
                    <p className="text-ocean-200">
                      Waiting for {isPlayer1 ? gameData.player2?.name : gameData.player1.name} to place their ships...
                    </p>
                  </div>
                );
              }
            })()}
          </div>
        )}

        {gameData?.status === 'IN_PROGRESS' && currentPlayer && (
          <BattleInterface
            gameData={gameData}
            currentPlayer={currentPlayer}
            onAttack={handleAttack}
            isAttacking={isAttacking}
          />
        )}

        {gameData?.status === 'COMPLETED' && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-white mb-2">Game Complete!</h2>
              <p className="text-ocean-200">
                Winner: {gameData.winner === gameData.player1.id ? gameData.player1.name : gameData.player2?.name}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 