'use client';

import { useState, useEffect, useRef } from 'react';
import { CheckCircle, X, Ship, Target, Trophy, Skull } from 'lucide-react';

interface Notification {
  id: string;
  type: 'ship_sunk' | 'ship_lost' | 'game_won' | 'game_lost' | 'attack_result';
  title: string;
  message: string;
  duration?: number;
  persistent?: boolean;
}

interface GameNotificationsProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

export default function GameNotifications({ notifications, onDismiss }: GameNotificationsProps) {
  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    const timers = timersRef.current;
    const currentNotificationIds = new Set(notifications.map(n => n.id));
    
    // Clean up timers for notifications that no longer exist
    timers.forEach((timer: NodeJS.Timeout, id: string) => {
      if (!currentNotificationIds.has(id)) {
        clearTimeout(timer);
        timers.delete(id);
      }
    });

    // Create timers for new notifications
    notifications.forEach(notification => {
      if (!notification.persistent && 
          notification.duration !== 0 && 
          !timers.has(notification.id)) {
        const duration = notification.duration || 3000;
        const timer = setTimeout(() => {
          onDismiss(notification.id);
          timers.delete(notification.id);
        }, duration);
        timers.set(notification.id, timer);
      }
    });

    // Cleanup all timers on unmount
    return () => {
      timers.forEach((timer: NodeJS.Timeout) => clearTimeout(timer));
      timers.clear();
    };
  }, [notifications, onDismiss]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'ship_sunk':
        return <Target className="h-6 w-6 text-green-400" />;
      case 'ship_lost':
        return <Skull className="h-6 w-6 text-red-400" />;
      case 'game_won':
        return <Trophy className="h-6 w-6 text-yellow-400" />;
      case 'game_lost':
        return <Skull className="h-6 w-6 text-red-400" />;
      case 'attack_result':
        return <Target className="h-6 w-6 text-blue-400" />;
      default:
        return <CheckCircle className="h-6 w-6 text-blue-400" />;
    }
  };

  const getNotificationColors = (type: string) => {
    switch (type) {
      case 'ship_sunk':
        return 'bg-green-500/20 border-green-500/50 text-green-100';
      case 'ship_lost':
        return 'bg-red-500/20 border-red-500/50 text-red-100';
      case 'game_won':
        return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-100';
      case 'game_lost':
        return 'bg-red-500/20 border-red-500/50 text-red-100';
      case 'attack_result':
        return 'bg-blue-500/20 border-blue-500/50 text-blue-100';
      default:
        return 'bg-blue-500/20 border-blue-500/50 text-blue-100';
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`border rounded-lg p-4 shadow-lg backdrop-blur-sm transition-all duration-300 ${getNotificationColors(notification.type)}`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-3">
              {getNotificationIcon(notification.type)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold mb-1">{notification.title}</h4>
              <p className="text-sm opacity-90">{notification.message}</p>
            </div>
            {!notification.persistent && (
              <button
                onClick={() => onDismiss(notification.id)}
                className="flex-shrink-0 ml-2 opacity-70 hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// Hook for managing notifications
export function useGameNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = `notification-${Date.now()}-${Math.random()}`;
    const notificationWithDefaults = {
      ...notification,
      id,
      duration: notification.duration ?? 5000 // Default to 5 seconds if not specified
    };
    setNotifications(prev => [...prev, notificationWithDefaults]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll
  };
} 