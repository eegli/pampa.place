import { LatLngLiteral, MapData } from '@/config/maps';
import { useAppDispatch } from '@/redux/hooks';
import { Result } from '@/redux/slices/game';
import React, { useEffect, useRef } from 'react';
import { config } from '../../config/google';
import { markers } from '../../config/markers';
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

declare global {
  interface Window {
    __GMAP: google.maps.Map | undefined;
  }
}

function GoogleMap({ mode, scores, initialPos, mapData }: GoogleMapProps) {
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.__GMAP) {
      const mapDiv = document.getElementById('GMAP')!;
      window.__GMAP = new google.maps.Map(mapDiv);
      console.log('created new map instance');
    }

    if (ref.current) {
      const mapDiv = document.getElementById('GMAP')!;

      mapDiv.style.height = '100%';
      mapDiv.style.width = '100%';
      ref.current.appendChild(mapDiv);

      return () => {
        mapDiv.style.height = '0';
        mapDiv.style.width = '0';
        document.body.appendChild(mapDiv);
      };
    }
  }, []);

  useEffect(() => {
    if (window.__GMAP) {
      window.__GMAP.setOptions({
        ...config.map,
      });
      const sw = new google.maps.LatLng(mapData.computed.bbLiteral.SW);
      const ne = new google.maps.LatLng(mapData.computed.bbLiteral.NE);

      /* Order in constructor is important! SW, NE  */
      const mapBounds = new google.maps.LatLngBounds(sw, ne);

      window.__GMAP.fitBounds(mapBounds, 2);
    }
  }, [mapData.computed.bbLiteral.NE, mapData.computed.bbLiteral.SW]);

  /* If the map is used in preview mode */
  useEffect(() => {
    if (window.__GMAP && mode === MapMode.PREVIEW) {
      window.__GMAP.setOptions({
        ...config.map,
        mapTypeId: 'roadmap',
        mapTypeControl: false,
        gestureHandling: 'none',
      });

      const features = window.__GMAP.data.addGeoJson(mapData.base);
      window.__GMAP.data.setStyle({
        fillColor: '#003d80',
        fillOpacity: 0.2,
        strokeWeight: 0.8,
      });

      return () => {
        features.forEach(feat => {
          if (window.__GMAP) {
            window.__GMAP.data.remove(feat);
          }
        });
      };
    }
  }, [mode, mapData.base]);

  /* Map in actual game mode */
  useEffect(() => {
    if (window.__GMAP && mode === MapMode.PLAY) {
      const marker = new google.maps.Marker();

      const listener = window.__GMAP.addListener(
        'click',
        ({ latLng }: { latLng: google.maps.LatLng }) => {
          marker.setPosition(latLng);
          marker.setMap(window.__GMAP!);

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
    if (window.__GMAP && scores && initialPos && mode === MapMode.RESULT) {
      const gMarkers: google.maps.Marker[] = [];
      gMarkers.push(
        new window.google.maps.Marker({
          position: initialPos,
          map: window.__GMAP,
        })
      );

      scores.forEach((p, idx) => {
        gMarkers.push(
          new window.google.maps.Marker({
            position: p.selected,
            map: window.__GMAP,
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
    <div
      ref={ref}
      style={{
        height: '100%',
        width: '100%',
      }}
    />
  );
}

export default GoogleMap;
