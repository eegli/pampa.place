import {config} from '@/config/game';
import {MapData} from '@/config/types';
import {calcDist, calcScore} from '@/utils/geo';
import {OrNull} from '@/utils/types';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {MAPS} from 'src/maps';

export type Result = {
  name: string;
  selected: OrNull<google.maps.LatLngLiteral>;
  dist: number;
  score: number;
};

export enum STATUS {
  UNINITIALIZED = 'UNINITIALIZED',
  PENDING_PLAYER = 'PENDING_PLAYER',
  ROUND_ONGOING = 'ROUND_ONGOING',
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

const initialMapValues: MapData = MAPS.values().next().value;

const initialState: GameState = {
  status: STATUS.UNINITIALIZED,
  mapId: initialMapValues.properties.id,
  mapName: initialMapValues.properties.name,
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
      Object.assign(state, initialState);
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
      const newId = MAPS.get(action.payload);
      newId
        ? (state.mapName = newId.properties.name)
        : (state.mapName = 'Unknown map');
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
    startOrResumeRound(state) {
      state.status = STATUS.ROUND_ONGOING;
    },
    setPlayerScore(
      state,
      {
        payload,
      }: PayloadAction<{
        selected: OrNull<google.maps.LatLngLiteral>;
        initial: OrNull<google.maps.LatLngLiteral>;
      }>
    ) {
      // Payload when the user fails to set a location in time
      let score = 0;
      let dist = -1;
      let selected: OrNull<google.maps.LatLngLiteral> = null;
      const map = MAPS.get(state.mapId);
      // User managed to set a location
      if (payload.selected && payload.initial && map) {
        dist = calcDist(payload.initial, payload.selected);
        score = calcScore(map.properties.area, dist);
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
      for (let i = 0; i <= state.rounds.progress; i++) {
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
  startOrResumeRound,
  endRound,
  resetRound,
  setPlayerScore,
  setRounds,
  setMap,
  setPlayers,
  setTimeLimit,
} = gameSlice.actions;
export default gameSlice;
