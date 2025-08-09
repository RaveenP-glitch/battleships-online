'use client';

import { useState } from 'react';
import { Target, Shield, Clock, Trophy, AlertCircle } from 'lucide-react';
import GameBoard from './GameBoard';

interface BattleInterfaceProps {
  gameData: any;
  currentPlayer: any;
  onAttack: (x: number, y: number) => Promise<void>;
  isAttacking: boolean;
}

export default function BattleInterface({ 
  gameData, 
  currentPlayer, 
  onAttack, 
  isAttacking 
}: BattleInterfaceProps) {
  const [targetPosition, setTargetPosition] = useState<{ x: number; y: number } | null>(null);
  const [error, setError] = useState('');

  const isMyTurn = gameData.currentTurn === currentPlayer?.playerId;
  const isPlayer1 = currentPlayer?.playerId === gameData.player1.id;
  const myGrid = isPlayer1 ? gameData.player1.grid : gameData.player2?.grid || {};
  const opponentGrid = isPlayer1 ? gameData.player2?.grid || {} : gameData.player1.grid;
  const opponent = isPlayer1 ? gameData.player2 : gameData.player1;

  const handleAttackClick = async (x: number, y: number) => {
    if (!isMyTurn || isAttacking) return;

    // Check if this cell has already been attacked
    const cellKey = `${x},${y}`;
    const hasBeenAttacked = gameData.moves.some((move: any) => 
      move.x === x && move.y === y && move.playerId === currentPlayer?.playerId
    );

    if (hasBeenAttacked) {
      setError('You have already attacked this position!');
      return;
    }

    setError('');
    try {
      await onAttack(x, y);
    } catch (err) {
      setError('Attack failed. Please try again.');
    }
  };

  const getMyMoves = () => {
    return gameData.moves.filter((move: any) => move.playerId === currentPlayer?.playerId);
  };

  const getOpponentMoves = () => {
    return gameData.moves.filter((move: any) => move.playerId !== currentPlayer?.playerId);
  };

  const getShipCount = (playerGrid: any) => {
    const shipCells = Object.values(playerGrid).filter((cell: any) => cell.hasShip);
    const hitShipCells = shipCells.filter((cell: any) => cell.isHit);
    return {
      total: shipCells.length,
      hits: hitShipCells.length,
      remaining: shipCells.length - hitShipCells.length
    };
  };

  const myShipStatus = getShipCount(myGrid);
  const opponentShipStatus = getShipCount(opponentGrid);

  return (
    <div className="space-y-6">
      {/* Game Status */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Battle in Progress!</h2>
          <div className="flex items-center space-x-4">
            {isMyTurn ? (
              <div className="flex items-center text-green-400">
                <Clock className="h-5 w-5 mr-2" />
                <span className="font-semibold">Your Turn</span>
              </div>
            ) : (
              <div className="flex items-center text-orange-400">
                <Clock className="h-5 w-5 mr-2" />
                <span className="font-semibold">Opponent's Turn</span>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-100 flex items-center mb-4">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Player Stats */}
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Shield className="h-5 w-5 text-primary-400 mr-2" />
              <span className="text-white font-semibold">Your Fleet</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-ocean-200">Ship Cells:</span>
                <span className="text-white">{myShipStatus.total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ocean-200">Hits Taken:</span>
                <span className="text-red-400">{myShipStatus.hits}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ocean-200">Health:</span>
                <span className="text-green-400">{myShipStatus.remaining}</span>
              </div>
            </div>
          </div>

          {/* Opponent Stats */}
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Target className="h-5 w-5 text-secondary-400 mr-2" />
              <span className="text-white font-semibold">{opponent?.name}'s Fleet</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-ocean-200">Your Hits:</span>
                <span className="text-green-400">{opponentShipStatus.hits}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ocean-200">Total Attacks:</span>
                <span className="text-white">{getMyMoves().length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ocean-200">Hit Rate:</span>
                <span className="text-yellow-400">
                  {getMyMoves().length > 0 
                    ? `${Math.round((getMyMoves().filter((m: any) => m.result === 'HIT' || m.result === 'SUNK').length / getMyMoves().length) * 100)}%`
                    : '0%'
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Enemy Waters (Attack Grid) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Target className="h-5 w-5 mr-2 text-secondary-400" />
              Enemy Waters
            </h3>
            {isMyTurn && (
              <span className="text-sm text-green-400 font-medium">Click to attack!</span>
            )}
          </div>
          
          <div className="bg-white/5 p-4 rounded-lg">
            <GameBoard
              grid={opponentGrid}
              onCellClick={isMyTurn ? handleAttackClick : undefined}
              isOpponentBoard={true}
              showShips={false}
              moves={getMyMoves()}
              className={isMyTurn && !isAttacking ? 'cursor-crosshair' : ''}
            />
          </div>

          {isMyTurn && (
            <div className="text-center">
              <p className="text-ocean-200 text-sm">
                {isAttacking ? 'Launching attack...' : 'Select a cell to attack'}
              </p>
            </div>
          )}
        </div>

        {/* Your Fleet (Defense Grid) */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Shield className="h-5 w-5 mr-2 text-primary-400" />
            Your Fleet
          </h3>
          
          <div className="bg-white/5 p-4 rounded-lg">
            <GameBoard
              grid={myGrid}
              showShips={true}
              moves={getOpponentMoves()}
            />
          </div>

          <div className="text-center">
            <p className="text-ocean-200 text-sm">
              Your ships and enemy attacks are shown above
            </p>
          </div>
        </div>
      </div>

      {/* Turn Instructions */}
      <div className="bg-white/5 rounded-lg p-4 text-center">
        {isMyTurn ? (
          <div className="text-green-400">
            <Target className="h-8 w-8 mx-auto mb-2" />
            <p className="font-semibold">It's your turn!</p>
            <p className="text-sm text-ocean-200 mt-1">
              Click on a cell in the Enemy Waters grid to launch your attack.
            </p>
          </div>
        ) : (
          <div className="text-orange-400">
            <Clock className="h-8 w-8 mx-auto mb-2" />
            <p className="font-semibold">Waiting for {opponent?.name}</p>
            <p className="text-sm text-ocean-200 mt-1">
              Your opponent is selecting their next target...
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 