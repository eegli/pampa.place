import {config} from '@/config/google';
import {RootState} from '@/redux/store';
import {randomPointInMap} from '@/utils/geo';
import {createAsyncThunk} from '@reduxjs/toolkit';
import {MAPS} from 'src/maps';
import {PositionState} from '.';

export interface ValidationError {
  code: 'UNKNOWN_ERROR' | 'ZERO_RESULTS';
  name: 'MapsRequestError';
  endpoint: string;
  message: string;
}

type RandomStreetViewRes = {pos: google.maps.LatLngLiteral} & Pick<
  PositionState,
  'panoDescription' | 'panoId'
>;

export const getRandomStreetView = createAsyncThunk<
  RandomStreetViewRes,
  void,
  {
    rejectValue: ValidationError;
    state: RootState;
  }
>('location/getRandomStreetView', async (_, {rejectWithValue, getState}) => {
  const {game} = getState();

  const randomPreference =
    Math.random() > 0.5
      ? google.maps.StreetViewPreference.BEST
      : google.maps.StreetViewPreference.NEAREST;

  const service = new google.maps.StreetViewService();

  const reqDefaults: google.maps.StreetViewLocationRequest = {
    preference: randomPreference,
    source: google.maps.StreetViewSource.OUTDOOR,
    radius: config.svRequest.radius,
  };

  let retries = 50;
  /* eslint-disable @typescript-eslint/no-non-null-assertion */
  const map = MAPS.get(game.mapId)!;

  try {
    while (true) {
      retries--;
      let data: google.maps.StreetViewPanoramaData | null = null;
      const randomLocation = randomPointInMap(map.properties.bb, map.geometry);

      try {
        const {data: svData} = await service.getPanorama({
          ...reqDefaults,
          location: randomLocation,
        });

        data = svData;
      } catch (err) {
        if (!retries) {
          throw err;
        } else {
          console.warn(`Unable to find random Street View`);
        }
      }

      if (data) {
        // Avoid non-serializable data through redux
        const location = data.location?.latLng;
        const lat = location?.lat() || 0;
        const lng = location?.lng() || 0;

        const panoId = data.location?.pano || '';
        const panoDescription = data.location?.description || '';
        return {pos: {lat, lng}, panoId, panoDescription};
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    const err: ValidationError = {
      code: 'UNKNOWN_ERROR',
      name: 'MapsRequestError',
      endpoint: 'getRandomPanorama',
      message: 'Unknown error',
    };
    if (e.code === 'ZERO_RESULTS' && typeof e.message === 'string') {
      err.message = e.message;
      err.code = e.code;
    }

    return rejectWithValue(err);
  }
});
