type GameConfig = {
  maxPlayers: number;
  roundSelect: [number, number, number];
  timeLimitSelect: [number, number, number, true];
  timeLimit: number;
};

const gameConfig: GameConfig = {
  maxPlayers: 4,
  roundSelect: [1, 3, 5],
  timeLimitSelect: [30, 60, 120, true],
  timeLimit: 60,
};

export default gameConfig;
