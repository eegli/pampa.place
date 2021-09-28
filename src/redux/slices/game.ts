import { defaults } from '@/config/game';
import { defaultMap, LatLngLiteral, MapData } from '@/config/maps';
import { calcDist, calcScore } from '@/utils/geo';
import { OrNull } from '@/utils/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Result = {
  round: number;
  selected: OrNull<LatLngLiteral>;
  dist: number;
  score: number;
};

type Player = {
  totalScore: number;
} & { results: Result[] };

export enum STATUS {
  PENDING_START = 'PENDING_START', // Uninitialized
  ROUND_STARTED = 'ROUND_STARTED',
  INTERMISSION = 'INTERMISSION',
  ROUND_ENDED = 'ROUND_ENDED',
  FINISHED = 'FINISHED',
}

interface GameState {
  status: STATUS;

  map: MapData;
  players: {
    names: string[];
    scores: Record<string, Player>;
  };
  timeLimit: number;
  rounds: {
    current: number;
    progress: number;
    total: number;
  };
}

const initialState: GameState = {
  status: STATUS.PENDING_START,

  map: defaultMap,
  players: {
    names: [],
    scores: {},
  },
  timeLimit: defaults.timeLimit,
  rounds: {
    current: 1,
    total: defaults.round,
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
      state.players.names = action.payload.filter(Boolean);
    },
    setRounds(state, action: PayloadAction<number>) {
      state.rounds.total = action.payload;
    },
    setTimeLimit(state, action: PayloadAction<number>) {
      state.timeLimit = action.payload;
    },
    setMap(state, action: PayloadAction<MapData>) {
      state.map = action.payload;
    },
    initGame(state) {
      if (!state.players.names.length) {
        state.players.names = ['Player 1'];
      }

      state.players.scores = {};

      state.players.names.forEach(name => {
        state.players.scores[name] = { totalScore: 0, results: [] };
      });

      state.rounds.current = 1;
      state.rounds.progress = 0;

      state.status = STATUS.INTERMISSION;
    },
    finishRound(state) {
      state.rounds.current++;
      state.rounds.progress = 0;

      // Game has ended
      if (state.rounds.total < state.rounds.current) {
        state.status = STATUS.FINISHED;
      } else {
        state.status = STATUS.INTERMISSION;
      }
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
      // Set current round score
      const player = state.players.scores[state.players.names[0]];

      // Payload when the user fails to set a location in time
      let score = 0;
      let dist = -1;
      let selected: OrNull<LatLngLiteral> = null;

      // User managed to set a location
      if (payload.selected && payload.initial) {
        dist = calcDist(payload.initial, payload.selected);
        score = calcScore(state.map.computed.area, dist);
        selected = payload.selected;
      }

      const newScore = player.totalScore + score;
      const existingResults = player.results;

      state.players.scores[state.players.names[0]] = {
        totalScore: newScore,
        results: [
          ...existingResults,
          {
            round: state.rounds.current,
            selected,
            dist,
            score,
          },
        ],
      };

      // Set round progress
      state.rounds.progress++;

      // Rotate players
      const last = state.players.names.pop();
      if (last) state.players.names.unshift(last);

      // Same round, wait for player change
      if (state.rounds.progress < state.players.names.length) {
        // Display popup
        state.status = STATUS.INTERMISSION;
        // Round is over, reset round progress
      } else {
        // Update overall score and force a new random location
        state.status = STATUS.ROUND_ENDED;
      }
    },
  },
});

export const {
  reset,
  initGame,
  startRound,
  finishRound,
  setPlayerScore,
  setRounds,
  setMap,
  setPlayers,
  setTimeLimit,
} = gameSlice.actions;
export default gameSlice.reducer;
