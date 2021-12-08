import {PaletteMode} from '@mui/material';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface AppState {
  authError: boolean;
  apiKey: string | undefined;
  theme: PaletteMode;
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
    setApiKey(state, {payload}: PayloadAction<string | undefined>) {
      state.apiKey = payload;
    },
    setTheme(state, {payload}: PayloadAction<PaletteMode>) {
      state.theme = payload;
    },
  },
});

export const {setApiKey, setTheme} = appSlice.actions;
export default appSlice;
