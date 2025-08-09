'use client';

import { useState } from 'react';
import { RotateCw, Ship, CheckCircle, AlertCircle } from 'lucide-react';
import GameBoard from './GameBoard';

interface ShipPlacementProps {
  onShipsPlaced: (ships: Omit<ShipData, 'id'>[]) => void;
  isSubmitting: boolean;
}

interface ShipData {
  id: string;
  type: string;
  startX: number;
  startY: number;
  direction: 'HORIZONTAL' | 'VERTICAL';
}

interface ShipTemplate {
  id: string;
  type: string;
  name: string;
  size: number;
  color: string;
}

const SHIP_TEMPLATES: ShipTemplate[] = [
  { id: 'battleship-1', type: 'BATTLESHIP', name: 'Battleship', size: 4, color: 'bg-red-500' },
  { id: 'destroyer-1', type: 'DESTROYER', name: 'Destroyer 1', size: 3, color: 'bg-blue-500' },
  { id: 'destroyer-2', type: 'DESTROYER', name: 'Destroyer 2', size: 3, color: 'bg-green-500' },
];

export default function ShipPlacement({ onShipsPlaced, isSubmitting }: ShipPlacementProps) {
  const [placedShips, setPlacedShips] = useState<ShipData[]>([]);
  const [selectedShip, setSelectedShip] = useState<ShipTemplate | null>(null);
  const [shipDirection, setShipDirection] = useState<'HORIZONTAL' | 'VERTICAL'>('HORIZONTAL');
  const [previewPosition, setPreviewPosition] = useState<{ x: number; y: number } | null>(null);
  const [error, setError] = useState('');

  const GRID_SIZE = 10;

  // Create grid with placed ships
  const createGrid = () => {
    const grid: Record<string, { hasShip: boolean; isHit: boolean; shipId?: string }> = {};
    
    placedShips.forEach((ship, shipIndex) => {
      for (let i = 0; i < getShipSize(ship.type); i++) {
        const x = ship.direction === 'HORIZONTAL' ? ship.startX + i : ship.startX;
        const y = ship.direction === 'VERTICAL' ? ship.startY + i : ship.startY;
        const cellKey = `${x},${y}`;
        grid[cellKey] = { hasShip: true, isHit: false, shipId: `ship-${shipIndex}` };
      }
    });

    // Add preview ship if selecting
    if (selectedShip && previewPosition) {
      const isValidPlacement = checkValidPlacement(previewPosition.x, previewPosition.y, selectedShip.size, shipDirection);
      if (isValidPlacement) {
        for (let i = 0; i < selectedShip.size; i++) {
          const x = shipDirection === 'HORIZONTAL' ? previewPosition.x + i : previewPosition.x;
          const y = shipDirection === 'VERTICAL' ? previewPosition.y + i : previewPosition.y;
          const cellKey = `${x},${y}`;
          if (!grid[cellKey]) {
            grid[cellKey] = { hasShip: true, isHit: false, shipId: 'preview' };
          }
        }
      }
    }

    return grid;
  };

  const getShipSize = (shipType: string) => {
    const template = SHIP_TEMPLATES.find(t => t.type === shipType);
    return template?.size || 0;
  };

  const checkValidPlacement = (x: number, y: number, size: number, direction: 'HORIZONTAL' | 'VERTICAL') => {
    // Check bounds
    if (direction === 'HORIZONTAL') {
      if (x + size > GRID_SIZE) return false;
    } else {
      if (y + size > GRID_SIZE) return false;
    }

    // Check for overlaps with existing ships
    for (let i = 0; i < size; i++) {
      const checkX = direction === 'HORIZONTAL' ? x + i : x;
      const checkY = direction === 'VERTICAL' ? y + i : y;
      
      const isOccupied = placedShips.some(ship => {
        const shipSize = getShipSize(ship.type);
        for (let j = 0; j < shipSize; j++) {
          const shipX = ship.direction === 'HORIZONTAL' ? ship.startX + j : ship.startX;
          const shipY = ship.direction === 'VERTICAL' ? ship.startY + j : ship.startY;
          if (shipX === checkX && shipY === checkY) return true;
        }
        return false;
      });

      if (isOccupied) return false;
    }

    return true;
  };

  const handleCellClick = (x: number, y: number) => {
    if (!selectedShip) return;

    const isValid = checkValidPlacement(x, y, selectedShip.size, shipDirection);
    if (!isValid) {
      setError('Invalid ship placement! Ships cannot overlap or go out of bounds.');
      return;
    }

    const newShip: ShipData = {
      id: selectedShip.id,
      type: selectedShip.type,
      startX: x,
      startY: y,
      direction: shipDirection,
    };

    setPlacedShips(prev => [...prev, newShip]);
    setSelectedShip(null);
    setPreviewPosition(null);
    setError('');
  };

  const handleCellHover = (x: number, y: number) => {
    if (selectedShip) {
      setPreviewPosition({ x, y });
    }
  };

  const removeShip = (index: number) => {
    setPlacedShips(prev => prev.filter((_, i) => i !== index));
  };

  const getAvailableShips = () => {
    return SHIP_TEMPLATES.filter(template => {
      // Check if this specific ship template has already been placed
      return !placedShips.some(ship => ship.id === template.id);
    });
  };

  const canSubmit = placedShips.length === 3;

  const handleSubmit = () => {
    if (canSubmit) {
      // Convert ships to the format expected by the backend (without ID)
      const shipsForBackend = placedShips.map(ship => ({
        type: ship.type,
        startX: ship.startX,
        startY: ship.startY,
        direction: ship.direction,
      }));
      onShipsPlaced(shipsForBackend);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Place Your Ships</h2>
        <p className="text-ocean-200">
          Click on a ship below, then click on the grid to place it. You need to place 1 Battleship and 2 Destroyers.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-100 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Ship Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Available Ships</h3>
          
          <div className="space-y-3">
            {getAvailableShips().map((ship, index) => (
              <button
                key={`${ship.type}-${index}`}
                onClick={() => setSelectedShip(ship)}
                className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedShip?.type === ship.type && selectedShip.name === ship.name
                    ? 'border-primary-400 bg-primary-500/20'
                    : 'border-white/20 bg-white/10 hover:bg-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Ship className="h-5 w-5 text-white" />
                    <div className="text-left">
                      <div className="text-white font-semibold">{ship.name}</div>
                      <div className="text-ocean-200 text-sm">{ship.size} cells</div>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    {Array.from({ length: ship.size }, (_, i) => (
                      <div key={i} className={`w-4 h-4 ${ship.color} rounded`} />
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {selectedShip && (
            <div className="p-4 bg-white/10 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white font-semibold">Placing: {selectedShip.name}</span>
                <button
                  onClick={() => setShipDirection(prev => prev === 'HORIZONTAL' ? 'VERTICAL' : 'HORIZONTAL')}
                  className="flex items-center space-x-2 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                >
                  <RotateCw className="h-4 w-4 text-white" />
                  <span className="text-white text-sm">{shipDirection}</span>
                </button>
              </div>
              <p className="text-ocean-200 text-sm">
                Click on the grid to place this ship. Use the rotate button to change orientation.
              </p>
            </div>
          )}

          {/* Placed Ships */}
          {placedShips.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-white font-semibold">Placed Ships</h4>
              {placedShips.map((ship, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="text-white">
                    <span className="font-medium">
                      {SHIP_TEMPLATES.find(t => t.id === ship.id)?.name}
                    </span>
                    <span className="text-ocean-200 text-sm ml-2">
                      at {String.fromCharCode(65 + ship.startY)}{ship.startX + 1} ({ship.direction.toLowerCase()})
                    </span>
                  </div>
                  <button
                    onClick={() => removeShip(index)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Game Board */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Your Fleet</h3>
          <div 
            className="flex justify-center"
            onMouseLeave={() => setPreviewPosition(null)}
          >
            <GameBoard
              grid={createGrid()}
              onCellClick={handleCellClick}
              showShips={true}
              className="bg-white/5 p-4 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="text-center">
        <button
          onClick={handleSubmit}
          disabled={!canSubmit || isSubmitting}
          className="inline-flex items-center px-8 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Placing Ships...
            </>
          ) : (
            <>
              <CheckCircle className="h-5 w-5 mr-2" />
              Confirm Ship Placement {placedShips.length}/3
            </>
          )}
        </button>
      </div>
    </div>
  );
} 