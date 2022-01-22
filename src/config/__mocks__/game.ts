import {GameConfig} from '../types';

export const config: GameConfig = {
  maxPlayers: 4,
  rounds: [1, 2, 3],
  roundsDefault: 2,
  timeLimits: [30, 60, 120, -1],
  timeLimitsDefault: 30,
};
