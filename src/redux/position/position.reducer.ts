import config, { MapLatLng } from '@config';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getRandomCoords } from '../../utils';
import { RootState } from '../store';

interface ValidationErrors {
  code: 'ZERO_RESULTS';
  endpoint: string;
  message: string;
  name: 'MapsRequestError';
  stack: string;
}

interface PositionState {
  // The initial position is a random location on Google Maps with
  // StreetView available. To keep things simple, it is always
  // considered truthy, which means that it needs to be set on root
  // level as soon as the the app mounts (and before the game page can
  // be accessed).
  initialPosition: MapLatLng | null;

  // The user selected position
  selectedPosition: MapLatLng | null;

  error: ValidationErrors | null;

  errorRetries: number;
}

type RandomRequest = {
  radius: number;
};

export const getRandomStreetView = createAsyncThunk<
  MapLatLng,
  RandomRequest | void,
  {
    rejectValue: ValidationErrors;
    state: RootState;
  }
>(
  'location/getRandomStreetView',
  async (params, { rejectWithValue, getState }) => {
    const { game } = getState();

    const service = new window.google.maps.StreetViewService();
    const defaults: google.maps.StreetViewLocationRequest = {
      preference: google.maps.StreetViewPreference.NEAREST,
      radius: params?.radius || config.defaults.svRequest.radius,
    };
    try {
      const { data } = await service.getPanorama({
        ...defaults,
        location: getRandomCoords(game.map),
      });

      // Avoid non-serializable data through redux
      const location = data.location?.latLng;
      const lat = location?.lat() || 0;
      const lng = location?.lng() || 0;
      return { lat, lng };
    } catch (e) {
      let err = e as ValidationErrors;
      return rejectWithValue(err);
    }
  }
);

const initialState: PositionState = {
  initialPosition: null, //{ lat: 51.492145, lng: -0.192983 },
  selectedPosition: null,
  error: null,
  errorRetries: 3,
};

const positonSlice = createSlice({
  name: 'position',
  initialState,
  reducers: {
    resetSelectedPosition(state) {
      state.selectedPosition = null;
    },
    updateSelectedPosition(state, action: PayloadAction<MapLatLng>) {
      state.selectedPosition = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(
      getRandomStreetView.fulfilled,
      (state, action: PayloadAction<MapLatLng>) => {
        state.initialPosition = action.payload;
        state.error = null;
      }
    );
    builder.addCase(getRandomStreetView.rejected, (state, action) => {
      if (action.payload) {
        state.error = action.payload;
      }
    });
  },
});

export const { updateSelectedPosition, resetSelectedPosition } =
  positonSlice.actions;
export default positonSlice.reducer;
