import { config } from '@/config/google';
import { LatLngLiteral } from '@/config/maps';
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

  error: OrNull<ValidationErrors>;
  loading: boolean;
}

type RandomRequest = {
  radius: number;
};

const initialState: PositionState = {
  initialPosition: null, //{ lat: 51.492145, lng: -0.192983 },
  selectedPosition: null,
  loading: false,
  error: null,
};

export const getRandomStreetView = createAsyncThunk<
  LatLngLiteral,
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
    const reqDefaults: google.maps.StreetViewLocationRequest = {
      preference: google.maps.StreetViewPreference.NEAREST,
      radius: params?.radius || config.svRequest.radius,
    };

    try {
      const { data } = await service.getPanorama({
        ...reqDefaults,
        location: randomPointInMap(game.map),
      });

      // Avoid non-serializable data through redux
      const location = data.location?.latLng;
      const lat = location?.lat() || 0;
      const lng = location?.lng() || 0;

      /*       const panoId = data.location?.pano;

      if (panoId && window.__GSTV) {
        window.__GSTV.setPano(panoId);
      } */
      return { lat, lng };
    } catch (e) {
      let err = e as ValidationErrors;
      return rejectWithValue(err);
    }
  }
);

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
      }
    );
    builder.addCase(getRandomStreetView.pending, state => {
      state.loading = true;
    }),
      builder.addCase(getRandomStreetView.rejected, (state, action) => {
        if (action.payload) {
          state.loading = false;
          state.error = action.payload;
        }
      });
  },
});

export const { updateSelectedPosition, resetSelectedPosition } =
  positonSlice.actions;
export default positonSlice.reducer;
