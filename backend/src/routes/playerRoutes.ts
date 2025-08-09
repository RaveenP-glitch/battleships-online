import { Router } from 'express';
import { getPlayer } from '../controllers/playerController';

const router = Router();

router.get('/:playerId', getPlayer);             // GET /api/v1/players/:playerId

export default router; 