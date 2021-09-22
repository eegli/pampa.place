import * as turf from '@turf/turf';
import { BBox, FeatureCollection, Polygon } from '@turf/turf';
import customMaps from 'custom-maps';

// All maps need to be a polygon feature collection
type BaseMap = FeatureCollection<Polygon>;
export type CustomMap = Record<string, BaseMap>;

export type LatLngLiteral = { lat: number; lng: number };
export type BBoxLiteral = Record<'NE' | 'SE' | 'SW' | 'NW', LatLngLiteral>;

export type MapData = {
  name: string;
  computed: {
    // Area in km^2
    area: number;
    // Not needed for now
    center: LatLngLiteral;
    // Used to generate a random point
    bb: BBox;
    // Poly bounding box: SW SE NE NW
    bbLiteral: BBoxLiteral;
  };
  // Base can be used directly with google maps
  base: BaseMap;
};

const maps: MapData[] = [];

for (const [name, base] of Object.entries(customMaps)) {
  const bb = turf.bbox(base);
  const bbPoly = turf.bboxPolygon(bb);
  const center = turf.center(base).geometry.coordinates;
  maps.push({
    name,
    base,
    computed: {
      area: turf.area(base) * 1e-6,
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
  });
}

export default maps.sort((a, b) => (a.name > b.name ? 1 : -1));
