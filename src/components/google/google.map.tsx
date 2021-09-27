import { config } from '@/config/google';
import { LatLngLiteral, MapData } from '@/config/maps';
import { markers } from '@/config/markers';
import { useAppDispatch } from '@/redux/hooks';
import { Result } from '@/redux/slices/game';
import { Fade } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import { DomNodeIds } from '../../pages/_document';
import { updateSelectedPosition } from '../../redux/slices/position';

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

function GoogleMap({ mode, scores, initialPos, mapData }: GoogleMapProps) {
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mapDiv = document.getElementById(DomNodeIds.GOOGLE_MAP)!;

    if (!GLOBAL_MAP) {
      GLOBAL_MAP = new google.maps.Map(mapDiv);
      console.log('Created new Map instance');
    }
    if (ref.current) {
      mapDiv.style.display = 'block';
      ref.current.appendChild(mapDiv);

      return () => {
        mapDiv.style.display = 'none';
        document.body.appendChild(mapDiv);
      };
    }
  }, []);

  useEffect(() => {
    if (GLOBAL_MAP) {
      console.log('render');
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
}

export default GoogleMap;
