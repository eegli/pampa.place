import config, { MapData, MapLatLng } from '@config';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { calculateArea, calculateScore } from '../../utils';

export type Result = {
  round: number;
  selected: MapLatLng | null;
  dist: number;
  score: number;
};

type PlayerTotals = {
  totalScore: number;
};

type Player = PlayerTotals & { results: Result[] };

export enum STATUS {
  PENDING = 'PENDING',
  ROUND_STARTED = 'ROUND_STARTED',
  INTERMISSION = 'INTERMISSION',
  ROUND_ENDED = 'ROUND_ENDED',
  FINISHED = 'FINISHED',
}

interface GameState {
  initialized: boolean;
  map: MapData;
  mapArea: number;
  players: string[];
  playerInfo: Record<string, Player>;
  rounds: {
    current: number;
    progress: number;
    total: number;
  };
  status: STATUS;
}

const initialState: GameState = {
  initialized: false,
  map: config.maps[0],
  mapArea: 0,
  players: [],
  playerInfo: {},
  rounds: {
    current: 1,
    total: 3,
    progress: 0,
  },
  status: STATUS.PENDING,
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
    initGame(
      state,
      action: PayloadAction<{
        names: string[];
        rounds: number;
        map: MapData;
      }>
    ) {
      state.players = action.payload.names;

      action.payload.names.forEach(name => {
        state.playerInfo[name] = { totalScore: 0, results: [] };
      });

      state.map = action.payload.map;
      state.mapArea = calculateArea(action.payload.map);

      state.rounds.total = action.payload.rounds;
      state.rounds.current = 1;
      state.rounds.progress = 0;

      state.status = STATUS.INTERMISSION;
      state.initialized = true;
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
      { payload }: PayloadAction<Omit<Result, 'score' | 'round'>>
    ) {
      // Set current round score
      const player = state.playerInfo[state.players[0]];
      const score = calculateScore(state.mapArea, payload.dist);

      const newScore = player.totalScore + score;
      const existingResults = player.results;

      state.playerInfo[state.players[0]] = {
        totalScore: newScore,
        results: [
          ...existingResults,
          {
            round: state.rounds.current,
            dist: payload.dist,
            selected: payload.selected,
            score,
          },
        ],
      };

      // Set round progress
      state.rounds.progress++;

      // Rotate players
      const last = state.players.pop();
      if (last) state.players.unshift(last);

      // Same round, wait for player change
      if (state.rounds.progress < state.players.length) {
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

export const { reset, initGame, startRound, finishRound, setPlayerScore } =
  gameSlice.actions;
export default gameSlice.reducer;
