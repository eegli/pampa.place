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
  map: google.maps.MapOptions;
};

/* Game */
export type GameConfig = {
  maxPlayers: number;
  rounds: [number, number, number];
  roundsDefault: number;
  timeLimits: [number, number, number, number];
  timeLimitsDefault: number;
};

/* Geo utilities */
export type LatLngLiteral = {lat: number; lng: number};

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
  bbLiteral: Record<'NE' | 'SE' | 'SW' | 'NW', LatLngLiteral>;
}

/* Type for input GeoJSON data */
export type InputMapData = FeatureCollection<
  Polygon | MultiPolygon,
  BaseMapProperties
>;

export type MapData = Feature<Polygon | MultiPolygon, MapProperties>;

/*
  Final shape of the map data for the game. 
  1. Full, computed map data
  2. Collection of map properties 

  The rest of the application will only access the map data of this
  type
*/
export type MapDataCollection = Map<string, MapData>;
export type MapInfoCollection = MapProperties[];

/* Helper types for map generation */
type Input<T> = {
  map: T;
  category: string;
  transformer?: PropertyTransformer;
};
export type PropertyTransformer = (props: BaseMapProperties) => void;
export type MapDataGenerator<
  T = FeatureCollection<Polygon | MultiPolygon, BaseMapProperties>
> = (...inputs: Input<T>[]) => MapDataCollection;

export type GeoJSONValidator = (
  feat: Feature<Polygon | MultiPolygon, BaseMapProperties>,
  category: string,
  transformer?: PropertyTransformer
) => MapData;
