import config, { LatLngLiteral, MapData } from '@config';
import React, { useEffect, useRef, useState } from 'react';
import { Result } from '../../redux/game';
import { useAppDispatch } from '../../redux/hooks';
import { updateSelectedPosition } from '../../redux/position';

export enum MapMode {
  PREVIEW,
  PLAY,
  RESULT,
}

export type GoogleMapProps = {
  mapData: MapData;
  mode: MapMode;
  scores?: (Result & {
    name: string;
  })[];
  initialPos?: LatLngLiteral;
};

function GoogleMap({ mode, scores, initialPos, mapData }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();

  const dispatch = useAppDispatch();

  /*   Initialization */
  useEffect(() => {
    if (mapRef.current) {
      console.count('map render');

      const gmap = new window.google.maps.Map(mapRef.current, {
        ...config.defaults.gMap,
      });

      const sw = new google.maps.LatLng(mapData.computed.bbLiteral.SW);
      const ne = new google.maps.LatLng(mapData.computed.bbLiteral.NE);

      /* Order in constructor is important! SW, NE  */
      const mapBounds = new google.maps.LatLngBounds(sw, ne);

      gmap.fitBounds(mapBounds, 2);

      setMap(gmap);
    }
  }, [mapData.computed.bbLiteral.NE, mapData.computed.bbLiteral.SW]);

  /* If the map is used in preview mode */
  useEffect(() => {
    if (map && mode === MapMode.PREVIEW) {
      map.setOptions({
        mapTypeId: 'roadmap',
        mapTypeControl: false,
        gestureHandling: 'none',
      });

      map.data.addGeoJson(mapData.base);
      map.data.setStyle({
        fillColor: '#003d80',
        fillOpacity: 0.2,
        strokeWeight: 0.8,
      });
    }
  }, [map, mode, mapData.base]);

  /* Map in actual game mode */
  useEffect(() => {
    if (map && mode === MapMode.PLAY) {
      const marker = new google.maps.Marker();

      const listener = map.addListener(
        'click',
        ({ latLng }: { latLng: google.maps.LatLng }) => {
          marker.setPosition(latLng);
          marker.setMap(map);

          dispatch(
            updateSelectedPosition({ lat: latLng.lat(), lng: latLng.lng() })
          );
        }
      );
      return () => listener.remove();
    }
  }, [map, mode, dispatch]);

  /* End of round, display markers */
  useEffect(() => {
    if (map && scores && initialPos && mode === MapMode.RESULT) {
      new window.google.maps.Marker({
        position: initialPos,
        map,
      });

      scores.forEach((p, idx) => {
        new window.google.maps.Marker({
          position: p.selected,
          map,
          label: {
            text: p.name,
            color: 'white',
            className: 'map-marker',
          },
          icon: {
            path: config.defaults.marker.path,
            fillColor: `#${config.markers[idx]}`,
            fillOpacity: 1,
            anchor: new google.maps.Point(
              config.defaults.marker.anchor[0],
              config.defaults.marker.anchor[1]
            ),
            strokeWeight: 0,
            scale: 1,
            labelOrigin: new google.maps.Point(15, 60),
          },
        });
      });
    }
  });

  return (
    <div
      ref={mapRef}
      style={{
        height: '100%',
        width: '100%',
      }}
    />
  );
}

export default React.memo(GoogleMap, (prev, curr) => {
  return prev.mode === curr.mode && prev.mapData.name === curr.mapData.name;
});
