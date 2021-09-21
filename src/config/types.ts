/* Base types */
export type MapBounds = Record<
  'latMax' | 'latMin' | 'lngMax' | 'lngMin',
  number
>;
export type MapLatLng = Record<'lat' | 'lng', number>;
export type MapCenter = { center: MapLatLng };

export type MapEdges = Record<'NE' | 'SE' | 'SW' | 'NW', MapLatLng>;

interface CustomMap extends MapBounds {
  id: string;
}
export type UserMaps = CustomMap[];

export type MapData = CustomMap & MapCenter & MapEdges;

export type DefaultSettings = {
  game: {
    maxPlayers: number;
    timeLimit: number;
  };
  svRequest: google.maps.StreetViewLocationRequest;
  gStreetView: google.maps.StreetViewPanoramaOptions;
  gMap: google.maps.MapOptions;
  marker: {
    path: string;
    anchor: [number, number];
  };
};

export type MarkerColors = Record<string, string>;
