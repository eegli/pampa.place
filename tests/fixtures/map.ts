import {MapData} from '@/config/types';
import {FeatureCollection} from '@turf/helpers';

export const testMapCategory = 'test';
export const testMapName = 'my test map';
export const testMapId = 'test-my-test-map';

export const testMap: MapData = {
  type: 'Feature',
  properties: {
    name: testMapName,
    id: testMapId,
    category: testMapCategory,
    area: 34.542192851713864,
    bb: [
      8.472518920898438, 47.351384658074124, 8.576545715332031,
      47.407179440027875,
    ],
    bbLiteral: {
      SW: {
        lng: 8.472518920898438,
        lat: 47.351384658074124,
      },
      SE: {
        lng: 8.576545715332031,
        lat: 47.351384658074124,
      },
      NE: {
        lng: 8.576545715332031,
        lat: 47.407179440027875,
      },
      NW: {
        lng: 8.472518920898438,
        lat: 47.407179440027875,
      },
    },
  },
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [8.530540466308594, 47.35696679330478],
        [8.576202392578125, 47.351384658074124],
        [8.576545715332031, 47.36231578548192],
        [8.568305969238281, 47.38789042338135],
        [8.545989990234375, 47.39904637835624],
        [8.490028381347656, 47.407179440027875],
        [8.472518920898438, 47.39253902496185],
        [8.473548889160156, 47.37277963653446],
        [8.507537841796875, 47.357431944587034],
        [8.530540466308594, 47.35696679330478],
      ],
    ],
  },
};

// Keep the JSON format
// prettier-ignore
export const userInputFeatureCollection: FeatureCollection = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              8.530540466308594,
              47.35696679330478
            ],
            [
              8.576202392578125,
              47.351384658074124
            ],
            [
              8.530540466308594,
              47.35696679330478
            ]
          ]
        ]
      }
    }
  ]
}

export const userInputFeature = userInputFeatureCollection.features[0];
