import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface AppState {
  initialized: boolean;
  authError: boolean;
  apiKey: string;
}

const initialState: AppState = {
  initialized: false,
  authError: false,
  apiKey: '',
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    initialize(state) {
      state.initialized = true;
    },
    setApiKey(state, { payload }: PayloadAction<string>) {
      state.apiKey = payload;
    },
  },
});

export const getApiKey = (s: RootState) => s.app.apiKey;

export const isGameInitialized = (s: RootState) => s.app.initialized;

export const { initialize, setApiKey } = appSlice.actions;
export default appSlice.reducer;
