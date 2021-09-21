import { UserMapConfig } from './index';

const maps: UserMapConfig[] =
  // https://www.openstreetmap.org/export#map=10/47.3016/8.9786
  [
    {
      __name: 'Thurgau',
      // Up, down
      latMax: 47.6025,
      latMin: 47.5144,
      // Left and right
      lngMax: 8.9429,
      lngMin: 8.8364,
    },
    {
      __name: 'Zürcher Oberland',
      latMax: 47.5144,
      latMin: 47.2327,
      lngMax: 8.9429,
      lngMin: 8.6626,
    },
    {
      __name: 'Zürich',
      latMax: 47.4894,
      latMin: 47.2993,
      lngMax: 8.6524,
      lngMin: 8.4299,
    },
    {
      __name: 'CH Landscape',
      latMax: 47.339,
      latMin: 46.559,
      lngMax: 9.668,
      lngMin: 6.855,
    },
  ];

export default maps;
