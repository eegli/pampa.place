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

  panoId: string;
  panoDescription: string;
  searchRadius: number;

  error: OrNull<ValidationErrors>;
  loading: boolean;
}

const initialState: PositionState = {
  initialPosition: null, //{ lat: 51.492145, lng: -0.192983 },
  selectedPosition: null,
  panoId: '',
  panoDescription: '',
  searchRadius: config.svRequest.radius,
  loading: false,
  error: null,
};

type RandomSVRes = { pos: LatLngLiteral } & Pick<
  PositionState,
  'panoDescription' | 'panoId'
>;

export const getRandomStreetView = createAsyncThunk<
  RandomSVRes,
  void,
  {
    rejectValue: ValidationErrors;
    state: RootState;
  }
>('location/getRandomStreetView', async (_, { rejectWithValue, getState }) => {
  const { game } = getState();

  const randomPreference =
    Math.random() > 0.5
      ? google.maps.StreetViewPreference.BEST
      : google.maps.StreetViewPreference.NEAREST;

  const service = new window.google.maps.StreetViewService();
  const reqDefaults: google.maps.StreetViewLocationRequest = {
    preference: randomPreference,
    radius: 1000,
  };

  try {
    const map = MAPS[game.mapId];
    const { data } = await service.getPanorama({
      ...reqDefaults,
      location: randomPointInMap(map.computed.bb, map.geo),
    });

    console.log(data);

    // Avoid non-serializable data through redux
    const location = data.location?.latLng;
    const lat = location?.lat() || 0;
    const lng = location?.lng() || 0;

    const panoId = data.location?.pano || '';
    const panoDescription = data.location?.description || '';

    return { pos: { lat, lng }, panoId, panoDescription };
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
      (state, action: PayloadAction<RandomSVRes>) => {
        state.initialPosition = action.payload.pos;
        state.panoId = action.payload.panoId;
        state.panoDescription = action.payload.panoDescription;
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
