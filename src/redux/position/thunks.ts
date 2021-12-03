import {config} from '@/config/google';
import {MAPS} from '@/config/maps';
import {LatLngLiteral} from '@/config/types';
import {RootState} from '@/redux/store';
import {randomPointInMap} from '@/utils/geo';
import {createAsyncThunk} from '@reduxjs/toolkit';
import {PositionState} from '.';

export interface ValidationError {
  code?: 'ZERO_RESULTS';
  endpoint?: string;
  message?: string;
  name?: 'MapsRequestError';
  stack?: string;
}

type RandomStreetViewRes = {pos: LatLngLiteral} & Pick<
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
  const map = MAPS[game.mapId];

  try {
    while (true) {
      let data: google.maps.StreetViewPanoramaData | null = null;
      const randomLocation = randomPointInMap(map.bb, map.feature.geometry);

      try {
        let {data: svData} = await service.getPanorama({
          ...reqDefaults,
          location: randomLocation,
        });

        data = svData;
      } catch (err) {
        if (!retries) {
          throw err;
        } else {
          console.warn(`Unable to find random Street View`);
          retries--;
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
  } catch (e) {
    let err = e as ValidationError;
    return rejectWithValue(err);
  }
});
