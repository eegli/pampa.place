import { RootState } from '../store';
import { Result } from './game.reducer';

export const getActivePlayer = (s: RootState) => s.game.players[0];

export const getPlayerCount = (s: RootState) => s.game.players.length;

export const getRoundScores = (s: RootState) => {
  const final: Array<Result & { name: string }> = [];

  for (const [key, value] of Object.entries(s.game.playerInfo)) {
    final.push({
      name: key,
      ...value.results[s.game.rounds.current - 1],
    });
  }

  return final.sort((a, b) => (a.dist > b.dist ? 1 : b.dist > a.dist ? -1 : 0));
};

export const getTotalScores = (s: RootState) => {
  const final: { name: string; score: number }[] = [];

  for (const [key, value] of Object.entries(s.game.playerInfo)) {
    final.push({ name: key, score: value.totalScore });
  }

  return final.sort((a, b) =>
    a.score > b.score ? 1 : b.score > a.score ? -1 : 0
  );
};

export const shouldRequestNewSV = (s: RootState) =>
  s.game.rounds.progress === 0;

export const isFinished = (s: RootState) =>
  s.game.rounds.progress === s.game.players.length &&
  s.game.rounds.current === s.game.rounds.total;
