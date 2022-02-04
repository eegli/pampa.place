import {MapService} from '@/services/google';
import {render} from '@/tests/utils';
import {PreviewPage} from 'src/pages/preview.page';

beforeEach(() => {
  jest.clearAllMocks();
});

// The Google Map mocks do not bind geoJSON data to their instances.
// Instead, collect the features here to  make sure that geojson is
// added and removed correctly on unmount

const features: google.maps.Data.Feature[] = [];

jest.spyOn(MapService.map.data, 'addGeoJson').mockImplementation(f => {
  // @ts-expect-error test stuff
  features.push(f);
  return features;
});

jest.spyOn(MapService.map.data, 'forEach').mockImplementation(() => {
  for (let i = 0; i < features.length; ++i) {
    features.pop();
  }
});

describe('Integration, preview maps', () => {
  it('loads and removes GeoJSON', () => {
    expect(features).toHaveLength(0);
    const {unmount} = render(<PreviewPage />);
    // GeoJSON from our test map
    expect(features).toHaveLength(1);
    unmount();
    expect(features).toHaveLength(0);
  });
  it('can toggle Street View Coverage', () => {
    render(<PreviewPage />);
    // TODO inspect google mock instances once new version is out that supports it
  });
});
