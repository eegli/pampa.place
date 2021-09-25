// https://coolors.co/ef476f-ffd166-06d6a0-118ab2-073b4c

type MarkerConfig = {
  colors: Record<string, string>;
  svgMarker: {
    path: string;
    anchor: [number, number];
  };
};

// TODO put in palette
const markerConfig: MarkerConfig = {
  colors: {
    yellow: 'FFD166',
    red: 'EF476F',
    mint: '06D6A0',
    petrol: '073B4C',
    blue: '118AB2',
  },
  /* One that works: https://stackoverflow.com/a/63523618 */
  svgMarker: {
    path: `M13.04,41.77c-0.11-1.29-0.35-3.2-0.99-5.42c-0.91-3.17-4.74-9.54-5.49-10.79c-3.64-6.1-5.46-9.21-5.45-12.07
c0.03-4.57,2.77-7.72,3.21-8.22c0.52-0.58,4.12-4.47,9.8-4.17c4.73,0.24,7.67,3.23,8.45,4.07c0.47,0.51,3.22,3.61,3.31,8.11
c0.06,3.01-1.89,6.26-5.78,12.77c-0.18,0.3-4.15,6.95-5.1,10.26c-0.64,2.24-0.89,4.17-1,5.48C13.68,41.78,13.36,41.78,13.04,41.77z
`,
    anchor: [14, 43],
  },
};

export default {
  marker: markerConfig.svgMarker,
  colors: Object.values(markerConfig.colors),
};
