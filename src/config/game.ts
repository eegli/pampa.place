type GameConfig = {
  maxPlayers: number;
  rounds: [number, number, number];
  timeLimits: [number, number, number, number];
};

type GameConfigDefaults = {
  round: number;
  timeLimit: number;
};

export const config: GameConfig = {
  maxPlayers: 4,
  rounds: [1, 3, 5],
  // -1 for unlimited time
  timeLimits: [30, 60, 120, -1],
};

export const defaults: GameConfigDefaults = {
  round: 3,
  timeLimit: 30,
};
