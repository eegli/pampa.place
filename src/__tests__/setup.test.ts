/* 
There are a lot of Google implementations that are used in the thunks
that need to be mocked properly, e.g. StreetViewPreference and
StreetViewSource (see jest-setup.ts). Make sure they have a correctly
defined initial implementation that can later be overwritten
individually for each test. 
*/

describe('__Google mock setup__', () => {
  it('street view service resolves', async () => {
    const service = new google.maps.StreetViewService();
    expect(service).toBeTruthy();
    expect(await service.getPanorama({})).toMatchInlineSnapshot(`
Object {
  "data": Object {
    "copyright": "Copyright",
    "imageDate": "August 2020",
    "links": Array [],
    "location": Object {
      "description": "Fake panorama description",
      "latLng": Object {
        "lat": 0,
        "lng": 0,
      },
      "pano": "69",
      "shortDescription": null,
    },
    "tiles": Object {
      "centerHeading": 0,
      "getTileUrl": [Function],
      "tileSize": Size {
        "height": 1,
        "toString": [MockFunction],
        "width": 1,
      },
      "worldSize": Size {
        "height": 1,
        "toString": [MockFunction],
        "width": 1,
      },
    },
  },
}
`);

    jest
      .spyOn(google.maps.StreetViewService.prototype, 'getPanorama')
      // @ts-ignore
      .mockImplementation(() => {
        return Promise.resolve({ok: true});
      });
    expect(await service.getPanorama({})).toMatchInlineSnapshot(`
Object {
  "ok": true,
}
`);
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
