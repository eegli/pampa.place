/* 
There are a lot of Google implementations that are used in the thunks
that need to be mocked properly, e.g. StreetViewPreference and
StreetViewSource (see jest-setup.ts). Make sure they have a correctly
defined initial implementation that can later be overwritten
individually for each test. 
*/

import {parseGeoJSONFeature} from '@/maps/helpers/parser';
import {testMap} from './fixtures/map';
import {GoogleStreetViewResponse} from './payloads/google';

describe('Mock map for tests', () => {
  it('fixtures match computed maps', () => {
    const computed = parseGeoJSONFeature(testMap, 'test');
    expect(computed).toStrictEqual(testMap);
  });
});

describe('Global mock setup', () => {
  it('street view service resolves', async () => {
    const service = new google.maps.StreetViewService();
    expect(service).toBeTruthy();
    expect(await service.getPanorama({})).toStrictEqual(
      GoogleStreetViewResponse
    );
    google.maps.StreetViewService.prototype.getPanorama = jest
      .fn()
      .mockResolvedValue({
        ok: true,
      });

    expect(await service.getPanorama({})).toMatchInlineSnapshot(`
      {
        "ok": true,
      }
    `);
  });
});
