import { GameStatus, ShipType, Direction, MoveResult } from '@prisma/client';
import { prisma } from '../config/database';
import { createError } from '../middleware/errorHandler';
import { 
  GameState, 
  ShipPlacement, 
  AttackResult, 
  GameGrid, 
  CellState,
  SHIP_CONFIG,
  GRID_SIZE 
} from '../types/game';

export class GameService {
  async createGame(playerName: string): Promise<GameState> {
    const player = await prisma.player.create({
      data: { name: playerName }
    });

    const game = await prisma.game.create({
      data: {
        player1Id: player.id,
        status: GameStatus.WAITING_FOR_PLAYER
      },
      include: {
        player1: true,
        player2: true,
        ships: true,
        moves: true
      }
    });

    return this.transformGameToState(game);
  }

  async joinGame(gameId: string, playerName: string): Promise<GameState> {
    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: { player1: true, player2: true, ships: true, moves: true }
    });

    if (!game) {
      throw createError('Game not found', 404);
    }

    if (game.player2Id) {
      throw createError('Game is already full', 400);
    }

    const player2 = await prisma.player.create({
      data: { name: playerName }
    });

    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: {
        player2Id: player2.id,
        status: GameStatus.PLACING_SHIPS
      },
      include: {
        player1: true,
        player2: true,
        ships: true,
        moves: true
      }
    });

    return this.transformGameToState(updatedGame);
  }

  async placeShips(gameId: string, playerId: string, ships: ShipPlacement[]): Promise<GameState> {
    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: { player1: true, player2: true, ships: true, moves: true }
    });

    if (!game) {
      throw createError('Game not found', 404);
    }

    if (game.status !== GameStatus.PLACING_SHIPS) {
      throw createError('Ships can only be placed during setup phase', 400);
    }

    // Validate ship placement
    this.validateShipPlacement(ships);

    // Remove existing ships for this player
    await prisma.ship.deleteMany({
      where: { gameId, playerId }
    });

    // Create new ships
    const shipData = ships.map(ship => ({
      gameId,
      playerId,
      type: ship.type,
      size: SHIP_CONFIG[ship.type].size,
      startX: ship.startX,
      startY: ship.startY,
      direction: ship.direction
    }));

    await prisma.ship.createMany({ data: shipData });

    // Check if both players have placed ships
    const allShips = await prisma.ship.findMany({
      where: { gameId }
    });

    const player1Ships = allShips.filter(ship => ship.playerId === game.player1Id);
    const player2Ships = allShips.filter(ship => ship.playerId === game.player2Id);

    let updatedGame = game;
    if (player1Ships.length === 3 && player2Ships.length === 3) {
      // Both players have placed all ships, start the game
      updatedGame = await prisma.game.update({
        where: { id: gameId },
        data: {
          status: GameStatus.IN_PROGRESS,
          currentTurn: game.player1Id // Player 1 goes first
        },
        include: {
          player1: true,
          player2: true,
          ships: true,
          moves: true
        }
      });
    } else {
      // Refetch game with updated ships
      updatedGame = await prisma.game.findUnique({
        where: { id: gameId },
        include: {
          player1: true,
          player2: true,
          ships: true,
          moves: true
        }
      }) as any;
    }

    return this.transformGameToState(updatedGame);
  }

  async attack(gameId: string, playerId: string, x: number, y: number): Promise<AttackResult> {
    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: { player1: true, player2: true, ships: true, moves: true }
    });

    if (!game) {
      throw createError('Game not found', 404);
    }

    if (game.status !== GameStatus.IN_PROGRESS) {
      throw createError('Game is not in progress', 400);
    }

    if (game.currentTurn !== playerId) {
      throw createError('It is not your turn', 400);
    }

    // Validate coordinates
    if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) {
      throw createError('Invalid coordinates', 400);
    }

    // Check if cell has already been attacked
    const existingMove = await prisma.move.findUnique({
      where: {
        gameId_playerId_x_y: { gameId, playerId, x, y }
      }
    });

    if (existingMove) {
      throw createError('Cell already attacked', 400);
    }

    const opponentId = game.player1Id === playerId ? game.player2Id : game.player1Id;
    
    if (!opponentId) {
      throw createError('Opponent not found', 400);
    }
    
    const opponentShips = game.ships.filter(ship => ship.playerId === opponentId);

    // Check if attack hits a ship
    const hitShip = this.checkHit(opponentShips, x, y);
    let result: MoveResult = MoveResult.MISS;
    let sunkShip = false;
    let gameOver = false;

    if (hitShip) {
      result = MoveResult.HIT;
      
      // Update ship hits
      const updatedShip = await prisma.ship.update({
        where: { id: hitShip.id },
        data: { 
          hits: hitShip.hits + 1,
          sunk: hitShip.hits + 1 >= hitShip.size
        }
      });

      if (updatedShip.sunk) {
        result = MoveResult.SUNK;
        sunkShip = true;

        // Check if all opponent ships are sunk
        const remainingShips = await prisma.ship.count({
          where: {
            gameId,
            playerId: opponentId!,
            sunk: false
          }
        });

        if (remainingShips === 0) {
          gameOver = true;
          await prisma.game.update({
            where: { id: gameId },
            data: {
              status: GameStatus.COMPLETED,
              winner: playerId,
              currentTurn: null
            }
          });
        }
      }
    }

    // Record the move
    await prisma.move.create({
      data: {
        gameId,
        playerId,
        x,
        y,
        result
      }
    });

    // Switch turns if game is not over
    if (!gameOver) {
      const nextTurn = game.player1Id === playerId ? game.player2Id : game.player1Id;
      await prisma.game.update({
        where: { id: gameId },
        data: { currentTurn: nextTurn }
      });
    }

    return { result, sunkShip, gameOver };
  }

  async getGameState(gameId: string): Promise<GameState> {
    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: {
        player1: true,
        player2: true,
        ships: true,
        moves: true
      }
    });

    if (!game) {
      throw createError('Game not found', 404);
    }

    return this.transformGameToState(game);
  }

  private validateShipPlacement(ships: ShipPlacement[]): void {
    // Check if we have the correct number of each ship type
    const shipCounts: Record<ShipType, number> = {
      [ShipType.BATTLESHIP]: 0,
      [ShipType.DESTROYER]: 0
    };

    ships.forEach(ship => {
      shipCounts[ship.type]++;
    });

    Object.entries(SHIP_CONFIG).forEach(([type, config]) => {
      if (shipCounts[type as ShipType] !== config.count) {
        throw createError(`Invalid ship count for ${type}`, 400);
      }
    });

    // Check for overlapping ships and valid positions
    const occupiedCells = new Set<string>();

    ships.forEach(ship => {
      const cells = this.getShipCells(ship);
      
      // Check if ship is within bounds
      cells.forEach(({ x, y }) => {
        if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) {
          throw createError('Ship placement out of bounds', 400);
        }

        const cellKey = `${x},${y}`;
        if (occupiedCells.has(cellKey)) {
          throw createError('Ships cannot overlap', 400);
        }
        occupiedCells.add(cellKey);
      });
    });
  }

  private getShipCells(ship: ShipPlacement): { x: number; y: number }[] {
    const cells: { x: number; y: number }[] = [];
    const size = SHIP_CONFIG[ship.type].size;

    for (let i = 0; i < size; i++) {
      if (ship.direction === Direction.HORIZONTAL) {
        cells.push({ x: ship.startX + i, y: ship.startY });
      } else {
        cells.push({ x: ship.startX, y: ship.startY + i });
      }
    }

    return cells;
  }

  private checkHit(ships: any[], x: number, y: number): any | null {
    for (const ship of ships) {
      const cells = this.getShipCells({
        type: ship.type,
        startX: ship.startX,
        startY: ship.startY,
        direction: ship.direction
      });

      if (cells.some(cell => cell.x === x && cell.y === y)) {
        return ship;
      }
    }
    return null;
  }

  private transformGameToState(game: any): GameState {
    const player1Ships = game.ships.filter((ship: any) => ship.playerId === game.player1Id);
    const player2Ships = game.ships.filter((ship: any) => ship.playerId === game.player2Id);

    return {
      id: game.id,
      status: game.status,
      currentTurn: game.currentTurn,
      winner: game.winner,
      player1: {
        id: game.player1.id,
        name: game.player1.name,
        ships: player1Ships.map((ship: any) => ({
          type: ship.type,
          startX: ship.startX,
          startY: ship.startY,
          direction: ship.direction
        })),
        grid: this.buildGrid(player1Ships, game.moves.filter((move: any) => move.playerId !== game.player1Id))
      },
      player2: game.player2 ? {
        id: game.player2.id,
        name: game.player2.name,
        ships: player2Ships.map((ship: any) => ({
          type: ship.type,
          startX: ship.startX,
          startY: ship.startY,
          direction: ship.direction
        })),
        grid: this.buildGrid(player2Ships, game.moves.filter((move: any) => move.playerId !== game.player2Id))
      } : undefined,
      moves: game.moves.map((move: any) => ({
        playerId: move.playerId,
        x: move.x,
        y: move.y,
        result: move.result,
        timestamp: move.createdAt
      }))
    };
  }

  private buildGrid(ships: any[], opponentMoves: any[]): GameGrid {
    const grid: GameGrid = {};

    // Mark ship positions
    ships.forEach(ship => {
      const cells = this.getShipCells({
        type: ship.type,
        startX: ship.startX,
        startY: ship.startY,
        direction: ship.direction
      });

      cells.forEach(({ x, y }) => {
        const key = `${x},${y}`;
        grid[key] = {
          hasShip: true,
          isHit: false,
          shipId: ship.id
        };
      });
    });

    // Mark hits from opponent
    opponentMoves.forEach(move => {
      const key = `${move.x},${move.y}`;
      if (grid[key]) {
        grid[key].isHit = true;
      }
    });

    return grid;
  }
} 