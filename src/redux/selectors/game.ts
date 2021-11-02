import { createSelector } from '@reduxjs/toolkit';
import { Result } from '../slices/game';
import { RootState } from '../store';

export const getActivePlayer = (s: RootState) => s.game.players.names[0];

export const getPlayerCount = (s: RootState) => s.game.players.names.length;

// TODO use memoization once redux toolkit exports reselect 4.1
export const getRoundScores = createSelector(
  [
    (s: RootState) => s.game.players.scores,
    (s: RootState) => s.game.rounds.current - 1,
  ],
  (scores, currentRound) => {
    return Object.entries(scores)
      .reduce((acc, [playerName, playerScores]) => {
        acc.push({
          name: playerName,
          ...playerScores.results[currentRound],
        });
        return acc;
      }, [] as Array<Result & { name: string }>)
      .sort((a, b) => (a.score > b.score ? -1 : b.score > a.score ? 1 : 0));
  }
);

export const getTotalScores = createSelector(
  [(s: RootState) => s.game.players.scores],
  scores => {
    return Object.entries(scores)
      .reduce((acc, [playerName, playerScores]) => {
        acc.push({ name: playerName, score: playerScores.totalScore });
        return acc;
      }, [] as Array<{ name: string; score: number }>)
      .sort((a, b) => (a.score > b.score ? -1 : b.score > a.score ? 1 : 0));
  }
);

export const shouldRequestNewSV = (s: RootState) =>
  s.game.rounds.progress === 0;

export const isFinished = (s: RootState) =>
  s.game.rounds.progress === s.game.players.names.length &&
  s.game.rounds.current === s.game.rounds.total;
