import {LatLngLiteral} from '@/config/types';
import {OrNull} from '@/utils/types';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {getRandomStreetView, ValidationError} from './thunks';

export interface PositionState {
  // The initial position is a random location on Google Maps with
  // StreetView available
  initialPosition: OrNull<LatLngLiteral>;
  // The user selected position
  selectedPosition: OrNull<LatLngLiteral>;
  panoId: string;
  panoDescription: string;
  error: OrNull<ValidationError>;
  loading: boolean;
}

const initialState: PositionState = {
  initialPosition: null, //{ lat: 51.492145, lng: -0.192983 },
  selectedPosition: null,
  panoId: '',
  panoDescription: '',
  loading: false,
  error: null,
};

const positonSlice = createSlice({
  name: 'position',
  initialState,
  reducers: {
    resetError(state) {
      state.error = null;
    },
    resetSelectedPosition(state) {
      state.selectedPosition = null;
    },
    updateSelectedPosition(state, action: PayloadAction<LatLngLiteral>) {
      state.selectedPosition = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(getRandomStreetView.fulfilled, (state, action) => {
      state.initialPosition = action.payload.pos;
      state.panoId = action.payload.panoId;
      state.panoDescription = action.payload.panoDescription;
      state.loading = false;
      state.error = null;
    });
    builder.addCase(getRandomStreetView.pending, state => {
      state.initialPosition = null;
      state.selectedPosition = null;
      state.loading = true;
    });
    builder.addCase(getRandomStreetView.rejected, (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.error = action.payload;
      }
    });
  },
});

export const {updateSelectedPosition, resetSelectedPosition, resetError} =
  positonSlice.actions;
export default positonSlice;
