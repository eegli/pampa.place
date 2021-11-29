import {config} from '@/config/game';
import {MAPS, MAP_IDS} from '@/config/maps';
import {LatLngLiteral} from '@/config/types';
import {calcDist, calcScore} from '@/utils/geo';
import {OrNull} from '@/utils/types';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export type Result = {
  name: string;
  selected: OrNull<LatLngLiteral>;
  dist: number;
  score: number;
};

export enum STATUS {
  UNINITIALIZED = 'UNINITIALIZED',
  ROUND_STARTED = 'ROUND_STARTED',
  PENDING_PLAYER = 'PENDING_PLAYER',
  ROUND_ENDED = 'ROUND_ENDED',
  FINISHED = 'FINISHED',
}

export interface GameState {
  status: STATUS;
  mapId: string;
  mapName: string;
  players: string[];
  // Store the results for each round in the outer array. The innner
  // array consists of player result objects.
  scores: Result[][];
  timeLimit: number;
  rounds: {
    current: number;
    progress: number;
    total: number;
  };
}

const initialState: GameState = {
  status: STATUS.UNINITIALIZED,
  mapId: MAP_IDS[0].id,
  mapName: MAP_IDS[0].name,
  players: [],
  scores: [],
  timeLimit: config.timeLimitsDefault,
  rounds: {
    current: 1,
    total: config.roundsDefault,
    progress: 0,
  },
};

const gameSlice = createSlice({
  name: 'game',
  initialState,

  // The active player is always at index 0, and players are rotated
  // when they are done
  reducers: {
    reset(state) {
      state = initialState;
    },
    setPlayers(state, action: PayloadAction<string[]>) {
      state.players = action.payload.filter(Boolean).map(el => el.slice(0, 24));
    },
    setRounds(state, action: PayloadAction<number>) {
      state.rounds.total = action.payload;
    },
    setTimeLimit(state, action: PayloadAction<number>) {
      state.timeLimit = action.payload;
    },
    setMap(state, action: PayloadAction<string>) {
      state.mapId = action.payload;
      state.mapName = MAPS[action.payload].feature.properties.name;
    },
    initGame(state) {
      if (!state.players.length) {
        state.players = ['Player 1'];
      }
      state.scores = [];
      // Empty score array for first round
      state.scores.push([]);
      state.rounds.current = 1;
      state.rounds.progress = 0;
      state.status = STATUS.PENDING_PLAYER;
    },
    startRound(state) {
      state.status = STATUS.ROUND_STARTED;
    },
    setPlayerScore(
      state,
      {
        payload,
      }: PayloadAction<{
        selected: OrNull<LatLngLiteral>;
        initial: OrNull<LatLngLiteral>;
      }>
    ) {
      // Payload when the user fails to set a location in time
      let score = 0;
      let dist = -1;
      let selected: OrNull<LatLngLiteral> = null;

      // User managed to set a location
      if (payload.selected && payload.initial) {
        dist = calcDist(payload.initial, payload.selected);
        score = calcScore(MAPS[state.mapId].area, dist);
        selected = payload.selected;
      }

      state.scores[state.rounds.current - 1].push({
        name: state.players[0],
        selected,
        dist,
        score,
      });

      // Set round progress
      state.rounds.progress++;

      // Rotate players
      const last = state.players.pop();
      if (last) state.players.unshift(last);

      // Same round, wait for player change
      if (state.rounds.progress < state.players.length) {
        // Display popup
        state.status = STATUS.PENDING_PLAYER;
        // Round is over, reset round progress
      } else {
        // Update overall score and force a new random location
        state.status = STATUS.ROUND_ENDED;
      }
    },
    resetRound(state) {
      // Reset score for this round
      state.scores[state.rounds.current - 1] = [];

      // Reset round progress
      state.rounds.progress = 0;

      // Rotate to first player again
      for (let i = 0; i < state.rounds.progress; i++) {
        const playerName = state.players.pop();
        if (playerName) {
          state.players.unshift(playerName);
        }
      }

      // Set zero for current round scores
      state.status = STATUS.PENDING_PLAYER;
    },
    endRound(state) {
      // Game has ended
      if (state.rounds.total === state.rounds.current) {
        state.status = STATUS.FINISHED;
      } else {
        // Prepare for next round
        state.rounds.current++;
        state.rounds.progress = 0;
        state.scores.push([]);
        state.status = STATUS.PENDING_PLAYER;
      }
    },
  },
});

export const {
  reset,
  initGame,
  startRound,
  endRound,
  resetRound,
  setPlayerScore,
  setRounds,
  setMap,
  setPlayers,
  setTimeLimit,
} = gameSlice.actions;
export default gameSlice;
