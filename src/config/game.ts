type GameConfig = {
  maxPlayers: number;
  rounds: [number, number, number];
  roundsDefault: number;
  timeLimits: [number, number, number, number];
  timeLimitsDefault: number;
};

export const config: GameConfig = {
  maxPlayers: 4,
  rounds: [1, 3, 5],
  roundsDefault: 3,
  // -1 for unlimited time
  timeLimits: [30, 60, 120, -1],
  timeLimitsDefault: 60,
};
