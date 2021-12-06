/* 
There are a lot of Google implementations that are used in the thunks
that need to be mocked properly, e.g. StreetViewPreference and
StreetViewSource (see jest-setup.ts). Make sure they have a correctly
defined initial implementation that can later be overwritten
individually for each test. 
*/

import {StreetViewService} from './setup';

describe('__Google mock setup__', () => {
  it('street view service resolves', async () => {
    const service = new google.maps.StreetViewService();
    expect(service).toBeTruthy();
    expect(await service.getPanorama({})).toMatchSnapshot();
    StreetViewService.prototype.getPanorama = jest.fn().mockResolvedValue({
      ok: true,
    });

    expect(await service.getPanorama({})).toMatchSnapshot();
  });
  it('enums are defined', () => {
    expect(google.maps.StreetViewPreference).toMatchInlineSnapshot(`
      Object {
        "BEST": "best",
        "NEAREST": "nearest",
      }
    `);
    expect(google.maps.StreetViewSource).toMatchInlineSnapshot(`
      Object {
        "DEFAULT": "default",
        "OUTDOOR": "outdoor",
      }
    `);
  });
});

export {};
