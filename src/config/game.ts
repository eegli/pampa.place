type GameConfig = {
  maxPlayers: number;
  roundSelect: [number, number, number];
  timeLimit: number;
};

const gameConfig: GameConfig = {
  maxPlayers: 4,
  roundSelect: [1, 3, 5],
  timeLimit: 10,
};

export default gameConfig;
