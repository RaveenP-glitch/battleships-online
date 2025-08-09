import { Server as SocketIOServer, Socket } from 'socket.io';
import { GameService } from '../services/gameService';
import { 
  ServerToClientEvents, 
  ClientToServerEvents, 
  PlaceShipsRequest, 
  AttackRequest 
} from '../types/game';

type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

const gameService = new GameService();

export const initializeSocketHandlers = (io: SocketIOServer<ClientToServerEvents, ServerToClientEvents>) => {
  io.on('connection', (socket: TypedSocket) => {
    console.log(`Client connected: ${socket.id}`);

    // Join a game room
    socket.on('joinGame', async (gameId: string) => {
      try {
        await socket.join(gameId);
        console.log(`Socket ${socket.id} joined game ${gameId}`);

        // Get current game state and send to client
        const gameState = await gameService.getGameState(gameId);
        socket.emit('gameUpdated', gameState);

        // Notify other players in the room
        socket.to(gameId).emit('playerJoined', {
          id: socket.id,
          name: 'Player' // This would come from authentication in a real app
        });
      } catch (error) {
        console.error('Error joining game:', error);
        socket.emit('error', { 
          message: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    });

    // Leave a game room
    socket.on('leaveGame', (gameId: string) => {
      socket.leave(gameId);
      console.log(`Socket ${socket.id} left game ${gameId}`);
    });

    // Handle ship placement
    socket.on('placeShips', async (data: PlaceShipsRequest) => {
      try {
        const gameState = await gameService.placeShips(data.gameId, data.playerId, data.ships);
        
        // Notify all players in the game room
        io.to(data.gameId).emit('gameUpdated', gameState);

        // If game is now in progress, notify players
        if (gameState.status === 'IN_PROGRESS') {
          io.to(data.gameId).emit('gameStarted');
        }
      } catch (error) {
        console.error('Error placing ships:', error);
        socket.emit('error', { 
          message: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    });

    // Handle attack moves
    socket.on('attack', async (data: AttackRequest) => {
      try {
        const attackResult = await gameService.attack(data.gameId, data.playerId, data.x, data.y);
        
        // Get updated game state
        const gameState = await gameService.getGameState(data.gameId);
        
        // Notify all players in the game room
        io.to(data.gameId).emit('gameUpdated', gameState);

        // If game is over, notify players
        if (attackResult.gameOver && gameState.winner) {
          const winner = gameState.player1.id === gameState.winner 
            ? gameState.player1 
            : gameState.player2!;
          
          io.to(data.gameId).emit('gameEnded', {
            id: winner.id,
            name: winner.name
          });
        }
      } catch (error) {
        console.error('Error processing attack:', error);
        socket.emit('error', { 
          message: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  // Handle connection errors
  io.on('connect_error', (error) => {
    console.error('Socket.IO connection error:', error);
  });
}; 