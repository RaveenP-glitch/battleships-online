import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';

export const getPlayer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { playerId } = req.params;

    if (!playerId) {
      res.status(400).json({
        success: false,
        error: { message: 'Player ID is required' }
      });
      return;
    }

    const player = await prisma.player.findUnique({
      where: { id: playerId },
      include: {
        gamesAsPlayer1: {
          select: {
            id: true,
            status: true,
            createdAt: true,
            player2: { select: { id: true, name: true } }
          }
        },
        gamesAsPlayer2: {
          select: {
            id: true,
            status: true,
            createdAt: true,
            player1: { select: { id: true, name: true } }
          }
        }
      }
    });

    if (!player) {
      res.status(404).json({
        success: false,
        error: { message: 'Player not found' }
      });
      return;
    }

    const games = [
      ...player.gamesAsPlayer1.map(game => ({
        ...game,
        opponent: game.player2
      })),
      ...player.gamesAsPlayer2.map(game => ({
        ...game,
        opponent: game.player1
      }))
    ];

    res.status(200).json({
      success: true,
      data: {
        id: player.id,
        name: player.name,
        createdAt: player.createdAt,
        games
      }
    });
  } catch (error) {
    next(error);
  }
}; 