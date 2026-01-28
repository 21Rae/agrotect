
import React from 'react';
import { Zone, HealthStatus } from './types';

export const INITIAL_ZONES: Zone[] = [
  {
    id: 'z1',
    name: 'Growth Zone A',
    crop: 'Butterhead Lettuce',
    stage: 'Vegetative',
    lastSync: new Date().toISOString(),
    status: HealthStatus.OPTIMAL,
    currentData: {
      timestamp: new Date().toISOString(),
      pH: 6.2,
      temp: 24.5,
      humidity: 65,
      light: 25000,
      ec: 1.8
    }
  },
  {
    id: 'z2',
    name: 'Growth Zone B',
    crop: 'Basil (Genovese)',
    stage: 'Early Growth',
    lastSync: new Date().toISOString(),
    status: HealthStatus.WARNING,
    currentData: {
      timestamp: new Date().toISOString(),
      pH: 5.4,
      temp: 22.1,
      humidity: 72,
      light: 18000,
      ec: 2.1
    }
  }
];

export const MOCK_HISTORY = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  temp: 22 + Math.random() * 5,
  humidity: 60 + Math.random() * 15,
  pH: 5.8 + Math.random() * 0.8
}));
