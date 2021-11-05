import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

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
    const final = Array.from({ length: players.length }, (_, idx) => ({
      name: players[idx],
      score: 0,
    }));

    scores.forEach(round => {
      round.forEach((playerResult, playerIdx) => {
        final[playerIdx].score += playerResult.score;
      });
    });

    return final.sort((a, b) =>
      a.score > b.score ? -1 : b.score > a.score ? 1 : 0
    );
  }
);

const s = [
  [
    { name: 'e', round: 1, selected: 'x', dist: 1, score: 999 },
    { name: 'x', round: 1, selected: 'x', dist: 1, score: 999 },
  ],
  [
    { name: 'e', round: 2, selected: 'x', dist: 1, score: 999 },
    { name: 'x', round: 2, selected: 'x', dist: 1, score: 999 },
  ],
];

export const shouldRequestNewSV = (s: RootState) =>
  s.game.rounds.progress === 0;

export const isFinished = (s: RootState) =>
  s.game.rounds.progress === s.game.players.length &&
  s.game.rounds.current === s.game.rounds.total;
