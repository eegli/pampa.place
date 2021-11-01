import {
  BBox,
  Feature,
  FeatureCollection,
  MultiPolygon,
  Polygon,
} from '@turf/helpers';

export type MarkerConfig = {
  colors: Record<string, string>;
  svgMarker: {
    path: string;
    anchor: [number, number];
  };
};

export type GoogleConfig = {
  svRequest: {
    radius: number;
  }; // google.maps.StreetViewLocationRequest;
  streetview: google.maps.StreetViewPanoramaOptions;
  map: google.maps.MapOptions;
};

export type GameConfig = {
  maxPlayers: number;
  rounds: [number, number, number];
  roundsDefault: number;
  timeLimits: [number, number, number, number];
  timeLimitsDefault: number;
};

export type LatLngLiteral = { lat: number; lng: number };

// All maps eventually only need the name property
export type Properties = {
  name: string;
};

export type MapCollection = FeatureCollection<
  Polygon | MultiPolygon,
  Properties
>;
// Specific properties of the map data set of the EU
export type EUMapCollection = FeatureCollection<
  Polygon | MultiPolygon,
  {
    CNTR_CODE: string;
    NAME_LATN: string;
    NUTS_ID: string;
    FID: string;
  }
>;

// Full, computed map data
export type Maps<T = Properties> = Record<
  string,
  {
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
    geo: Feature<Polygon | MultiPolygon, T>;
  }
>;

export type MapIdCollection = {
  name: string;
  id: string;
}[];
