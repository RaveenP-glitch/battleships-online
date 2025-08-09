import axios, { AxiosError } from 'axios';
import {
  ApiResponse,
  CreateGameRequest,
  JoinGameRequest,
  PlaceShipsRequest,
  AttackRequest,
  GameState,
  AttackResult,
} from '@/types/game';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const API_VERSION = 'v1';

// Create axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}/api/${API_VERSION}`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API Functions
export const gameApi = {
  // Create a new game
  createGame: async (data: CreateGameRequest): Promise<GameState> => {
    try {
      const response = await api.post<ApiResponse<GameState>>('/games', data);
      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'Failed to create game');
      }
      return response.data.data!;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.error) {
        throw new Error(error.response.data.error.message);
      }
      throw error;
    }
  },

  // Join an existing game
  joinGame: async (gameId: string, playerName: string): Promise<GameState> => {
    try {
      const response = await api.post<ApiResponse<GameState>>(
        `/games/${gameId}/join`,
        { playerName }
      );
      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'Failed to join game');
      }
      return response.data.data!;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.error) {
        throw new Error(error.response.data.error.message);
      }
      throw error;
    }
  },

  // Get game state
  getGameState: async (gameId: string): Promise<GameState> => {
    try {
      const response = await api.get<ApiResponse<GameState>>(`/games/${gameId}`);
      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'Failed to get game state');
      }
      return response.data.data!;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.error) {
        throw new Error(error.response.data.error.message);
      }
      throw error;
    }
  },

  // Place ships
  placeShips: async (data: PlaceShipsRequest): Promise<GameState> => {
    try {
      const response = await api.post<ApiResponse<GameState>>(
        `/games/${data.gameId}/ships`,
        { playerId: data.playerId, ships: data.ships }
      );
      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'Failed to place ships');
      }
      return response.data.data!;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.error) {
        throw new Error(error.response.data.error.message);
      }
      throw error;
    }
  },

  // Attack a cell
  attack: async (data: AttackRequest): Promise<AttackResult> => {
    try {
      const response = await api.post<ApiResponse<AttackResult>>(
        `/games/${data.gameId}/attack`,
        { playerId: data.playerId, x: data.x, y: data.y }
      );
      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'Failed to attack');
      }
      return response.data.data!;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.error) {
        throw new Error(error.response.data.error.message);
      }
      throw error;
    }
  },
};

// Player API
export const playerApi = {
  // Get player info
  getPlayer: async (playerId: string): Promise<any> => {
    try {
      const response = await api.get<ApiResponse>(`/players/${playerId}`);
      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'Failed to get player');
      }
      return response.data.data!;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.error) {
        throw new Error(error.response.data.error.message);
      }
      throw error;
    }
  },
};

// Health check
export const healthCheck = async (): Promise<boolean> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`);
    return response.status === 200;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};

export default api; 