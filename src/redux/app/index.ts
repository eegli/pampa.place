import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface AppState {
  isLoading: boolean;
  authError: boolean;
  apiKey: string;
}

const initialState: AppState = {
  isLoading: false,
  authError: false,
  apiKey: '',
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setIsLoading(state, { payload }: PayloadAction<boolean>) {
      state.isLoading = payload;
    },
    setApiKey(state, { payload }: PayloadAction<string>) {
      state.apiKey = payload;
    },
  },
});

export const getApiKey = (s: RootState) => s.app.apiKey;

export const isLoading = (s: RootState) => s.app.isLoading;

export const { setApiKey, setIsLoading } = appSlice.actions;
export default appSlice.reducer;
