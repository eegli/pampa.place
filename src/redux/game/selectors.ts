import {createSelector} from '@reduxjs/toolkit';
import {RootState} from '../store';

export const getActivePlayer = (s: RootState) => s.game.players[0];

export const getPlayerCount = (s: RootState) => s.game.players.length;

function sortScores<T extends {score: number}[]>(scores: T): T {
  return scores.sort((a, b) =>
    a.score > b.score ? -1 : b.score > a.score ? 1 : 0
  );
}

export const getCurrentRoundScores = createSelector(
  (s: RootState) => s.game.scores,
  scores => {
    const lastScore = scores.length - 1;
    return sortScores(Array.from(scores[lastScore]));
  }
);

export const getTotalScores = createSelector(
  (s: RootState) => s.game.scores,
  (s: RootState) => s.game.players,
  (scores, players) => {
    const total = Array.from({length: players.length}, (_, idx) => ({
      name: players[idx],
      score: 0,
    }));

    scores.forEach(round => {
      round.forEach((playerResult, playerIdx) => {
        total[playerIdx].score += playerResult.score;
      });
    });

    return sortScores(total);
  }
);

export const isFinished = (s: RootState) =>
  s.game.rounds.progress === s.game.players.length &&
  s.game.rounds.current === s.game.rounds.total;
