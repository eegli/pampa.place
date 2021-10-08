import * as turf from '@turf/turf';
import { BBox, FeatureCollection, MultiPolygon, Polygon } from '@turf/turf';
import customMaps from '../../maps';

if (!Object.keys(customMaps).length) {
  throw new Error('No maps found! Provide at least one custom map');
}

export type LatLngLiteral = { lat: number; lng: number };

// All maps need to be a polygon feature collection
type Properties = {
  name: string;
};
export type BaseMapData = FeatureCollection<Polygon | MultiPolygon, Properties>;

// Full map properties with additional data
export type FullMapData = {
  type: 'custom' | 'default';
  computed: {
    // Area in km^2
    area: number;
    // Not needed for now
    center: LatLngLiteral;
    // Used to generate a random point
    bb: BBox;
    // Poly bounding box: SW SE NE NW
    bbLiteral: Record<'NE' | 'SE' | 'SW' | 'NW', LatLngLiteral>;
  };
  // Base can be used directly with google maps
  base: BaseMapData;
};

export const MAPS = customMaps.reduce((acc, curr) => {
  const bb = turf.bbox(curr);
  const bbPoly = turf.bboxPolygon(bb);
  const center = turf.center(curr.features[0]).geometry.coordinates;

  acc[curr.features[0].properties.name] = {
    base: curr,
    type: 'custom',
    computed: {
      area: turf.area(curr) * 1e-6,
      center: { lng: center[0], lat: center[1] },
      bb,
      bbLiteral: {
        SW: {
          lng: bbPoly.geometry.coordinates[0][0][0],
          lat: bbPoly.geometry.coordinates[0][0][1],
        },
        SE: {
          lng: bbPoly.geometry.coordinates[0][1][0],
          lat: bbPoly.geometry.coordinates[0][1][1],
        },
        NE: {
          lng: bbPoly.geometry.coordinates[0][2][0],
          lat: bbPoly.geometry.coordinates[0][2][1],
        },
        NW: {
          lng: bbPoly.geometry.coordinates[0][3][0],
          lat: bbPoly.geometry.coordinates[0][3][1],
        },
      },
    },
  };

  return acc;
}, <Record<string, FullMapData>>{});

export const mapIds = Object.keys(customMaps).sort();
