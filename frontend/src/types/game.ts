// Enums matching backend
export enum GameStatus {
  WAITING_FOR_PLAYER = 'WAITING_FOR_PLAYER',
  PLACING_SHIPS = 'PLACING_SHIPS',
  IN_PROGRESS = 'IN_PROGRESS',
  FINISHED = 'FINISHED',
}

export enum ShipType {
  BATTLESHIP = 'BATTLESHIP',
  DESTROYER = 'DESTROYER',
}

export enum Direction {
  HORIZONTAL = 'HORIZONTAL',
  VERTICAL = 'VERTICAL',
}

export enum MoveResult {
  MISS = 'MISS',
  HIT = 'HIT',
  SUNK = 'SUNK',
}

// Game interfaces
export interface Player {
  id: string;
  name: string;
  ships: ShipPlacement[];
  grid: GameGrid;
}

export interface GameState {
  id: string;
  status: GameStatus;
  currentTurn?: string;
  winner?: string;
  player1: Player;
  player2?: Player;
  moves: GameMove[];
}

export interface GameMove {
  playerId: string;
  x: number;
  y: number;
  result: MoveResult;
  timestamp: Date;
}

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

// API Request/Response types
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

export interface AttackResult {
  result: MoveResult;
  sunkShip?: boolean;
  gameOver?: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    statusCode?: number;
  };
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
  [ShipType.BATTLESHIP]: { size: 4, count: 1, name: 'Battleship' },
  [ShipType.DESTROYER]: { size: 3, count: 2, name: 'Destroyer' },
} as const;

export const GRID_SIZE = 10;

// UI Types
export interface GridCellProps {
  x: number;
  y: number;
  state: CellState;
  onClick?: (x: number, y: number) => void;
  isOwn?: boolean;
  canAttack?: boolean;
}

export interface GameBoardProps {
  grid: GameGrid;
  onCellClick?: (x: number, y: number) => void;
  isOwn?: boolean;
  title: string;
}

export interface ShipPlacementState {
  selectedShipType: ShipType | null;
  selectedDirection: Direction;
  placedShips: ShipPlacement[];
  isValid: boolean;
} 