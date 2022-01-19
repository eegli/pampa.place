/* 
There are a lot of Google implementations that are used in the thunks
that need to be mocked properly, e.g. StreetViewPreference and
StreetViewSource (see jest-setup.ts). Make sure they have a correctly
defined initial implementation that can later be overwritten
individually for each test. 
*/

describe('Test global setup', () => {
  it('has global definitions', () => {
    expect(google.maps).toMatchSnapshot();
    expect(google.maps.ControlPosition.BOTTOM_LEFT).toEqual(1);
  });
  it('event listeners return a listener object', () => {
    const l1 = google.maps.event.addListenerOnce({}, 'click', () => {});
    expect(l1.remove).toBeTruthy();
    const l2 = google.maps.MVCObject.prototype.addListener('click', () => {});
    expect(l2.remove).toBeTruthy();
  });
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

    google.maps.StreetViewService.prototype.getPanorama = jest
      .fn()
      .mockResolvedValue({
        ok: true,
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
