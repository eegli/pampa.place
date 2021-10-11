import { config } from '@/config/google';
import { LatLngLiteral, MAPS } from '@/config/maps';
import { RootState } from '@/redux/store';
import { randomPointInMap } from '@/utils/geo';
import { OrNull } from '@/utils/types';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

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
  initialPosition: OrNull<LatLngLiteral>;

  // The user selected position
  selectedPosition: OrNull<LatLngLiteral>;

  searchRadius: number;

  error: OrNull<ValidationErrors>;
  loading: boolean;
}

const initialState: PositionState = {
  initialPosition: null, //{ lat: 51.492145, lng: -0.192983 },
  selectedPosition: null,
  searchRadius: config.svRequest.radius,
  loading: false,
  error: null,
};

export const getRandomStreetView = createAsyncThunk<
  LatLngLiteral,
  void,
  {
    rejectValue: ValidationErrors;
    state: RootState;
  }
>('location/getRandomStreetView', async (_, { rejectWithValue, getState }) => {
  const { game, position } = getState();

  const service = new window.google.maps.StreetViewService();
  const reqDefaults: google.maps.StreetViewLocationRequest = {
    preference: google.maps.StreetViewPreference.BEST,
    radius: 1000,
  };

  try {
    const { data } = await service.getPanorama({
      ...reqDefaults,
      location: randomPointInMap(MAPS[game.mapId]),
    });

    // Avoid non-serializable data through redux
    const location = data.location?.latLng;
    const lat = location?.lat() || 0;
    const lng = location?.lng() || 0;

    console.log('yes');
    return { lat, lng };
  } catch (e) {
    let err = e as ValidationErrors;
    return rejectWithValue(err);
  }
});

const positonSlice = createSlice({
  name: 'position',
  initialState,
  reducers: {
    resetSelectedPosition(state) {
      state.selectedPosition = null;
    },
    updateSelectedPosition(state, action: PayloadAction<LatLngLiteral>) {
      state.selectedPosition = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(
      getRandomStreetView.fulfilled,
      (state, action: PayloadAction<LatLngLiteral>) => {
        state.initialPosition = action.payload;
        state.loading = false;
        state.error = null;
        state.searchRadius = config.svRequest.radius;
      }
    );
    builder.addCase(getRandomStreetView.pending, state => {
      state.loading = true;
    }),
      builder.addCase(getRandomStreetView.rejected, (state, action) => {
        if (action.payload) {
          state.loading = false;
          state.error = action.payload;
          state.searchRadius = state.searchRadius * 100;
        }
      });
  },
});

export const { updateSelectedPosition, resetSelectedPosition } =
  positonSlice.actions;
export default positonSlice.reducer;
