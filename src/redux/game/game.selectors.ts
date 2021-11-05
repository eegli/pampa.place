import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../redux.store';

export const getActivePlayer = (s: RootState) => s.game.players[0];

export const getPlayerCount = (s: RootState) => s.game.players.length;

// TODO use memoization once redux toolkit exports reselect 4.1
export const getRoundScores = createSelector(
  [
    (s: RootState) => s.game.scores,
    (s: RootState) => s.game.rounds.current - 1,
  ],
  (scores, currentRound) => {
    /* Sort on a copy, otherwise, Redux isn't happy: https://stackoverflow.com/a/66721870 */
    return [...scores[currentRound]].sort((a, b) =>
      a.score > b.score ? -1 : b.score > a.score ? 1 : 0
    );
  }
);

export const getTotalScores = createSelector(
  [(s: RootState) => s.game.scores, (s: RootState) => s.game.players],
  (scores, players) => {
    const total = Array.from({ length: players.length }, (_, idx) => ({
      name: players[idx],
      score: 0,
    }));

    scores.forEach(round => {
      round.forEach((playerResult, playerIdx) => {
        total[playerIdx].score += playerResult.score;
      });
    });

    return total.sort((a, b) =>
      a.score > b.score ? -1 : b.score > a.score ? 1 : 0
    );
  }
);

export const shouldRequestNewSV = (s: RootState) =>
  s.game.rounds.progress === 0;

export const isFinished = (s: RootState) =>
  s.game.rounds.progress === s.game.players.length &&
  s.game.rounds.current === s.game.rounds.total;
