import React, { useEffect, useRef, useState } from 'react';
import config, { MapEdges, MapLatLng } from '../../config';
import { Result } from '../../redux/game';
import { useAppDispatch } from '../../redux/hooks';
import { updateSelectedPosition } from '../../redux/position';

export enum MapMode {
  PREVIEW,
  PLAY,
  RESULT,
}

export type GoogleMapProps = {
  bounds: MapEdges;
  mode: MapMode;
  scores?: (Result & {
    name: string;
  })[];
  initialPos?: MapLatLng;
};

function GoogleMap({ mode, bounds, scores, initialPos }: GoogleMapProps) {
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
      /* Order in constructor is important! SW, NE  */
      const mapBounds = new google.maps.LatLngBounds(bounds.SW, bounds.NE);

      gmap.fitBounds(mapBounds);

      setMap(gmap);
    }
  }, [bounds.SW, bounds.NE]);

  /* If the map is used in preview mode */
  useEffect(() => {
    if (map && mode === MapMode.PREVIEW) {
      map.setOptions({
        mapTypeId: 'roadmap',
        mapTypeControl: false,
        gestureHandling: 'none',
      });

      const line = new google.maps.Polyline({
        strokeOpacity: 0.3,
      });

      line.setPath([bounds.NE, bounds.SE, bounds.SW, bounds.NW, bounds.NE]);
      line.setMap(map);
    }
  }, [map, mode, bounds]);

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
  return (
    prev.mode === curr.mode &&
    prev.bounds.SE.lat === curr.bounds.SE.lat &&
    prev.bounds.SE.lng === curr.bounds.SE.lng &&
    prev.bounds.SW.lat === curr.bounds.SW.lat &&
    prev.bounds.SW.lng === curr.bounds.SW.lng &&
    prev.bounds.NE.lat === curr.bounds.NE.lat &&
    prev.bounds.NE.lng === curr.bounds.NE.lng &&
    prev.bounds.NW.lat === curr.bounds.NW.lat &&
    prev.bounds.NW.lng === curr.bounds.NW.lng
  );
});
