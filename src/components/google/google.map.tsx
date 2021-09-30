import { config } from '@/config/google';
import { LatLngLiteral, MapData } from '@/config/maps';
import { markers } from '@/config/markers';
import { useAppDispatch } from '@/redux/hooks';
import { Result } from '@/redux/slices/game';
import { updateSelectedPosition } from '@/redux/slices/position';
import { Fade } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import { __unsafeToggleElement } from '../../utils/misc';

export const GoogleMapRoot = () => {
  return (
    <div
      id="__GMAP__"
      style={{ width: '100%', height: '100%', display: 'none' }}
    />
  );
};

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

export let GLOBAL_MAP: google.maps.Map | undefined;

const GoogleMap = ({ mode, scores, initialPos, mapData }: GoogleMapProps) => {
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mapContainer = document.getElementById('__GMAP__')!;

    GLOBAL_MAP ?? console.log('Creating new global Map instance');
    GLOBAL_MAP ??= new google.maps.Map(mapContainer);

    if (ref.current) {
      const revert = __unsafeToggleElement(mapContainer, ref.current);
      return () => {
        revert();
      };
    }
  }, []);

  useEffect(() => {
    if (GLOBAL_MAP) {
      GLOBAL_MAP.setOptions({
        ...config.map,
      });
      const sw = new google.maps.LatLng(mapData.computed.bbLiteral.SW);
      const ne = new google.maps.LatLng(mapData.computed.bbLiteral.NE);

      /* Order in constructor is important! SW, NE  */
      const mapBounds = new google.maps.LatLngBounds(sw, ne);
      GLOBAL_MAP.fitBounds(mapBounds, 2);
    }
  }, [mapData.computed.bbLiteral.NE, mapData.computed.bbLiteral.SW]);

  /* If the map is used in preview mode */
  useEffect(() => {
    if (GLOBAL_MAP && mode === MapMode.PREVIEW) {
      GLOBAL_MAP.setOptions({
        ...config.map,
        mapTypeId: 'roadmap',
        mapTypeControl: false,
        gestureHandling: 'none',
      });
      const features = GLOBAL_MAP.data.addGeoJson(mapData.base);
      GLOBAL_MAP.data.setStyle({
        fillColor: '#003d80',
        fillOpacity: 0.2,
        strokeWeight: 0.8,
      });
      return () => {
        features.forEach(feat => {
          if (GLOBAL_MAP) {
            GLOBAL_MAP.data.remove(feat);
          }
        });
      };
    }
  }, [mode, mapData.base]);

  /* Map in actual game mode */
  useEffect(() => {
    if (GLOBAL_MAP && mode === MapMode.PLAY) {
      GLOBAL_MAP.setOptions({
        ...config.map,
      });
      const marker = new google.maps.Marker();
      const listener = GLOBAL_MAP.addListener(
        'click',
        ({ latLng }: { latLng: google.maps.LatLng }) => {
          marker.setPosition(latLng);
          marker.setMap(GLOBAL_MAP!);

          dispatch(
            updateSelectedPosition({ lat: latLng.lat(), lng: latLng.lng() })
          );
        }
      );
      return () => {
        listener.remove();
        marker.setMap(null);
      };
    }
  }, [mode, dispatch]);

  /* End of round, display markers */
  useEffect(() => {
    if (GLOBAL_MAP && scores && initialPos && mode === MapMode.RESULT) {
      GLOBAL_MAP.setOptions({
        ...config.map,
      });
      const gMarkers: google.maps.Marker[] = [];
      gMarkers.push(
        new window.google.maps.Marker({
          position: initialPos,
          map: GLOBAL_MAP,
        })
      );
      scores.forEach((p, idx) => {
        gMarkers.push(
          new window.google.maps.Marker({
            position: p.selected,
            map: GLOBAL_MAP,
            label: {
              text: p.name,
              color: 'white',
              className: 'map-marker',
            },
            icon: {
              path: markers.marker.path,
              fillColor: `#${markers.colors[idx]}`,
              fillOpacity: 1,
              anchor: new google.maps.Point(
                markers.marker.anchor[0],
                markers.marker.anchor[1]
              ),
              strokeWeight: 0,
              scale: 1,
              labelOrigin: new google.maps.Point(15, 60),
            },
          })
        );
      });

      return () => {
        gMarkers.forEach(marker => marker.setMap(null));
      };
    }
  }, [scores, initialPos, mode]);
  const gmap = document.getElementById('__GMAP__')!;

  return (
    <Fade in timeout={500}>
      <div
        ref={ref}
        style={{
          height: '100%',
          width: '100%',
        }}
      />
    </Fade>
  );
};

export default GoogleMap;
