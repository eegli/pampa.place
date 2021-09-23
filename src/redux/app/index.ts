import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  authError: boolean;
  apiKey: string;
}

const initialState: AppState = {
  authError: false,
  apiKey: '',
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setApiKey(state, { payload }: PayloadAction<string>) {
      state.apiKey = payload;
    },
  },
});

export const { setApiKey } = appSlice.actions;
export default appSlice.reducer;
