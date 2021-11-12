import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface AppState {
  authError: boolean;
  apiKey: string | undefined;
  theme: 'dark' | 'light';
}

const initialState: AppState = {
  authError: false,
  apiKey: undefined,
  theme: 'dark',
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setApiKey(state, {payload}: PayloadAction<string>) {
      state.apiKey = payload;
    },
    toggleTheme(state) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
    },
  },
});

export const {setApiKey, toggleTheme} = appSlice.actions;
export default appSlice.reducer;
