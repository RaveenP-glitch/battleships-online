'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

export interface CellState {
  hasShip: boolean;
  isHit: boolean;
  shipId?: string;
}

export interface GameBoardProps {
  grid: Record<string, CellState>;
  onCellClick?: (x: number, y: number) => void;
  isOpponentBoard?: boolean;
  showShips?: boolean;
  moves?: Array<{ x: number; y: number; result: string }>;
  className?: string;
}

export default function GameBoard({ 
  grid, 
  onCellClick, 
  isOpponentBoard = false, 
  showShips = true,
  moves = [],
  className 
}: GameBoardProps) {
  const GRID_SIZE = 10;
  
  const getCellContent = (x: number, y: number) => {
    const cellKey = `${x},${y}`;
    const cell = grid[cellKey];
    const move = moves.find(m => m.x === x && m.y === y);
    
    // Check if this cell belongs to a sunk ship
    const cellBelongsToSunkShip = cell?.hasShip && cell?.isHit && cell?.shipId && checkIfSunkShip(cell.shipId);
    
    if (move) {
      return (move.result === 'HIT' || move.result === 'SUNK') ? (cellBelongsToSunkShip ? '💀' : '💥') : '💧';
    }
    
    if (cell?.isHit) {
      return cell.hasShip ? (cellBelongsToSunkShip ? '💀' : '💥') : '💧';
    }
    
    if (cell?.hasShip && (showShips || cell.isHit)) {
      return cellBelongsToSunkShip ? '💀' : '🚢';
    }
    
    return '';
  };

  // Helper function to check if a ship is sunk (would need to be passed as prop)
  const checkIfSunkShip = (shipId: string) => {
    // This would need ship data to determine if the ship is fully sunk
    // For now, return false as we don't have this information in the grid
    return false;
  };

  const getCellClassName = (x: number, y: number) => {
    const cellKey = `${x},${y}`;
    const cell = grid[cellKey];
    const move = moves.find(m => m.x === x && m.y === y);
    
    let baseClasses = "w-8 h-8 border border-ocean-300 flex items-center justify-center text-xs font-bold cursor-pointer transition-all duration-200 hover:bg-ocean-200/20";
    
    if ((move?.result === 'HIT' || move?.result === 'SUNK') || (cell?.isHit && cell?.hasShip)) {
      baseClasses += " bg-red-500/30 border-red-400";
    } else if (move?.result === 'MISS' || (cell?.isHit && !cell?.hasShip)) {
      baseClasses += " bg-blue-500/30 border-blue-400";
    } else if (cell?.hasShip && showShips) {
      baseClasses += " bg-gray-600/50 border-gray-500";
    } else {
      baseClasses += " bg-ocean-100/10 hover:bg-ocean-100/20";
    }
    
    return baseClasses;
  };

  return (
    <div className={cn("inline-block", className)}>
      {/* Column headers */}
      <div className="flex mb-1">
        <div className="w-6"></div>
        {Array.from({ length: GRID_SIZE }, (_, i) => (
          <div key={i} className="w-8 h-6 flex items-center justify-center text-ocean-200 text-xs font-semibold">
            {i}
          </div>
        ))}
      </div>
      
      {/* Grid with row headers */}
      {Array.from({ length: GRID_SIZE }, (_, y) => (
        <div key={y} className="flex">
          {/* Row header */}
          <div className="w-6 h-8 flex items-center justify-center text-ocean-200 text-xs font-semibold">
            {String.fromCharCode(65 + y)}
          </div>
          
          {/* Grid cells */}
          {Array.from({ length: GRID_SIZE }, (_, x) => (
            <div
              key={`${x}-${y}`}
              className={getCellClassName(x, y)}
              onClick={() => onCellClick && onCellClick(x, y)}
            >
              {getCellContent(x, y)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
} 