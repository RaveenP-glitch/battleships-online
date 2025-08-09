import { Request, Response, NextFunction } from 'express';
import { GameService } from '../services/gameService';
import { 
  CreateGameRequest, 
  JoinGameRequest, 
  PlaceShipsRequest, 
  AttackRequest 
} from '../types/game';

const gameService = new GameService();

export const createGame = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { playerName }: CreateGameRequest = req.body;

    if (!playerName || playerName.trim().length === 0) {
      res.status(400).json({
        success: false,
        error: { message: 'Player name is required' }
      });
      return;
    }

    const gameState = await gameService.createGame(playerName.trim());

    res.status(201).json({
      success: true,
      data: gameState
    });
  } catch (error) {
    next(error);
  }
};

export const joinGame = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { gameId } = req.params;
    const { playerName }: Omit<JoinGameRequest, 'gameId'> = req.body;

    if (!gameId) {
      res.status(400).json({
        success: false,
        error: { message: 'Game ID is required' }
      });
      return;
    }

    if (!playerName || playerName.trim().length === 0) {
      res.status(400).json({
        success: false,
        error: { message: 'Player name is required' }
      });
      return;
    }

    const gameState = await gameService.joinGame(gameId, playerName.trim());

    res.status(200).json({
      success: true,
      data: gameState
    });
  } catch (error) {
    next(error);
  }
};

export const getGameState = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { gameId } = req.params;
    
    if (!gameId) {
      res.status(400).json({
        success: false,
        error: { message: 'Game ID is required' }
      });
      return;
    }
    
    const gameState = await gameService.getGameState(gameId);

    res.status(200).json({
      success: true,
      data: gameState
    });
  } catch (error) {
    next(error);
  }
};

export const placeShips = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { gameId } = req.params;
    const { playerId, ships }: Omit<PlaceShipsRequest, 'gameId'> = req.body;

    if (!gameId) {
      res.status(400).json({
        success: false,
        error: { message: 'Game ID is required' }
      });
      return;
    }

    if (!playerId) {
      res.status(400).json({
        success: false,
        error: { message: 'Player ID is required' }
      });
      return;
    }

    if (!ships || !Array.isArray(ships) || ships.length !== 3) {
      res.status(400).json({
        success: false,
        error: { message: 'Exactly 3 ships must be provided' }
      });
      return;
    }

    const gameState = await gameService.placeShips(gameId, playerId, ships);

    res.status(200).json({
      success: true,
      data: gameState
    });
  } catch (error) {
    next(error);
  }
};

export const attack = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { gameId } = req.params;
    const { playerId, x, y }: Omit<AttackRequest, 'gameId'> = req.body;

    if (!gameId) {
      res.status(400).json({
        success: false,
        error: { message: 'Game ID is required' }
      });
      return;
    }

    if (!playerId) {
      res.status(400).json({
        success: false,
        error: { message: 'Player ID is required' }
      });
      return;
    }

    if (typeof x !== 'number' || typeof y !== 'number') {
      res.status(400).json({
        success: false,
        error: { message: 'Valid coordinates (x, y) are required' }
      });
      return;
    }

    const result = await gameService.attack(gameId, playerId, x, y);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
}; 