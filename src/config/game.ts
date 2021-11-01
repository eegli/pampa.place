import { GameConfig } from './types';

export const config: GameConfig = {
  maxPlayers: 4,
  rounds: [1, 3, 5],
  roundsDefault: 3,
  // -1 for unlimited time
  timeLimits: [30, 60, 120, -1],
  timeLimitsDefault: 60,
};
