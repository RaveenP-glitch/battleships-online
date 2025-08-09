import { Router } from 'express';
import {
  createGame,
  joinGame,
  getGameState,
  placeShips,
  attack
} from '../controllers/gameController';

const router = Router();

// Game management routes
router.post('/', createGame);                    // POST /api/v1/games
router.get('/:gameId', getGameState);            // GET /api/v1/games/:gameId
router.post('/:gameId/join', joinGame);          // POST /api/v1/games/:gameId/join

// Gameplay routes
router.post('/:gameId/ships', placeShips);       // POST /api/v1/games/:gameId/ships
router.post('/:gameId/attack', attack);          // POST /api/v1/games/:gameId/attack

export default router; 