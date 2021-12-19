import {config as gameConfig} from '../game';
import {config as googleConfig} from '../google';

describe('Game config', () => {
  it('includes unlimited time mode', () => {
    expect(gameConfig.timeLimits).toContain(-1);
  });
  it('defaults options are included by the config', () => {
    expect(gameConfig.rounds).toContain(gameConfig.roundsDefault);
    expect(gameConfig.timeLimits).toContain(gameConfig.timeLimitsDefault);
  });
});

describe('Google config', () => {
  it('matches snapshot', () => {
    expect(googleConfig).toMatchInlineSnapshot(`
      Object {
        "map": Object {
          "clickableIcons": false,
          "disableDefaultUI": true,
          "draggableCursor": "crosshair",
          "gestureHandling": "auto",
          "mapTypeControl": true,
          "mapTypeControlOptions": Object {
            "mapTypeIds": Array [
              "hybrid",
              "roadmap",
            ],
          },
          "mapTypeId": "roadmap",
        },
        "streetview": Object {
          "addressControl": false,
          "clickToGo": true,
          "disableDoubleClickZoom": false,
          "fullscreenControl": false,
          "motionTracking": false,
          "motionTrackingControl": false,
          "pov": Object {
            "heading": 35,
            "pitch": 10,
          },
          "showRoadLabels": false,
          "zoom": 0,
          "zoomControl": false,
        },
        "svRequest": Object {
          "radius": 100,
        },
      }
    `);
  });
});
