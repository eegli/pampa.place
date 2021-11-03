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
export type BaseProperties = {
  name: string;
};

export type EUMapProperties = {
  CNTR_CODE: string;
  NAME_LATN: string;
  NUTS_ID: string;
  FID: string;
};

export type MapCollection<T> = FeatureCollection<Polygon | MultiPolygon, T>;

// Full, computed map data
export type Maps<T = BaseProperties> = Record<
  string,
  {
    // Area in km^2
    area: number;
    // Used to generate a random point
    bb: BBox;
    // Poly bounding box: SW SE NE NW
    bbLiteral: Record<'NE' | 'SE' | 'SW' | 'NW', LatLngLiteral>;

    // Base can be used directly with google maps
    feature: Feature<Polygon | MultiPolygon, T>;
  }
>;

export type MapIdCollection = {
  name: string;
  id: string;
}[];
