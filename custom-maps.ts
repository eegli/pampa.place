import { UserMaps } from '@config';

const maps: UserMaps =
  // https://www.openstreetmap.org/export#map=10/47.3016/8.9786
  [
    {
      id: 'Thurgau',
      // Up, down
      latMax: 47.6025,
      latMin: 47.5144,
      // Left and right
      lngMax: 8.9429,
      lngMin: 8.8364,
    },
    {
      id: 'Zürcher Oberland',
      latMax: 47.5144,
      latMin: 47.2327,
      lngMax: 8.9429,
      lngMin: 8.6626,
    },
    {
      id: 'Zürich',
      latMax: 47.4894,
      latMin: 47.2993,
      lngMax: 8.6524,
      lngMin: 8.4299,
    },
    {
      id: 'CH Landscape',
      latMax: 47.339,
      latMin: 46.559,
      lngMax: 9.668,
      lngMin: 6.855,
    },
  ];

export default maps;
