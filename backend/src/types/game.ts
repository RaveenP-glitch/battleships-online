import { GameStatus, ShipType, Direction, MoveResult } from '@prisma/client';

export interface GameGrid {
  [key: string]: CellState; // "x,y" -> CellState
}

export interface CellState {
  hasShip: boolean;
  isHit: boolean;
  shipId?: string;
}

export interface ShipPlacement {
  type: ShipType;
  startX: number;
  startY: number;
  direction: Direction;
}

export interface AttackMove {
  x: number;
  y: number;
  playerId: string;
}

export interface AttackResult {
  result: MoveResult;
  sunkShip?: boolean;
  gameOver?: boolean;
}

export interface GameState {
  id: string;
  status: GameStatus;
  currentTurn?: string;
  winner?: string;
  player1: {
    id: string;
    name: string;
    ships: ShipPlacement[];
    grid: GameGrid;
  };
  player2?: {
    id: string;
    name: string;
    ships: ShipPlacement[];
    grid: GameGrid;
  };
  moves: {
    playerId: string;
    x: number;
    y: number;
    result: MoveResult;
    timestamp: Date;
  }[];
}

export interface CreateGameRequest {
  playerName: string;
}

export interface JoinGameRequest {
  gameId: string;
  playerName: string;
}

export interface PlaceShipsRequest {
  gameId: string;
  playerId: string;
  ships: ShipPlacement[];
}

export interface AttackRequest {
  gameId: string;
  playerId: string;
  x: number;
  y: number;
}

// Socket event types
export interface ServerToClientEvents {
  gameUpdated: (gameState: GameState) => void;
  playerJoined: (player: { id: string; name: string }) => void;
  gameStarted: () => void;
  gameEnded: (winner: { id: string; name: string }) => void;
  error: (error: { message: string }) => void;
}

export interface ClientToServerEvents {
  joinGame: (gameId: string) => void;
  leaveGame: (gameId: string) => void;
  placeShips: (data: PlaceShipsRequest) => void;
  attack: (data: AttackRequest) => void;
}

// Ship configuration
export const SHIP_CONFIG = {
  [ShipType.BATTLESHIP]: { size: 4, count: 1 },
  [ShipType.DESTROYER]: { size: 3, count: 2 },
} as const;

export const GRID_SIZE = 10; 