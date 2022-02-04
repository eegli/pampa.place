import {
  BBox,
  Feature,
  FeatureCollection,
  MultiPolygon,
  Polygon,
} from '@turf/helpers';

/* Google */
export type GoogleConfig = {
  svRequest: {
    radius: number;
  };
  streetview: google.maps.StreetViewPanoramaOptions;
  map: Record<
    'default' | 'preview' | 'play' | 'review',
    google.maps.MapOptions
  >;
  marker: {
    svg: {
      path: string;
      anchor: [number, number];
    };
    colors: string[];
  };
};

/* Game */
export type GameConfig = {
  maxPlayers: number;
  rounds: [number, number, number];
  roundsDefault: number;
  timeLimits: [number, number, number, number];
  timeLimitsDefault: number;
};

/* Each input map needs to have at least these properties */
export interface BaseMapProperties {
  name: string;
}

/* Full, computed property per GeoJSON feature */
export interface MapProperties extends BaseMapProperties {
  category: string;
  id: string;
  // Area in km^2
  area: number;
  // Used to generate a random point
  bb: BBox;
  // Poly bounding box: SW SE NE NW
  bbLiteral: Record<'NE' | 'SE' | 'SW' | 'NW', google.maps.LatLngLiteral>;
}

/* Type for all GeoJSON data */
export type MapData = Feature<Polygon | MultiPolygon, MapProperties>;

/* Helper types for map generation */
type Input<Type> = {
  collection: Type;
  category: string;
};

export type MapGenerator<Type = FeatureCollection<Polygon | MultiPolygon>> = (
  ...inputs: Input<Type>[]
) => Map<string, MapData>;

export type FeatureParser<Type = Feature<Polygon | MultiPolygon>> = (
  feat: Type,
  category: string
) => MapData;

export type UserGeoJSONParser = (
  rawMap: string,
  name: string,
  category: string
) => MapData;

export type LocalMapEnhancer<T = Map<string, MapData>> = (map: T) => T;

export type LocalStorageMaps = Record<string, MapData>;
