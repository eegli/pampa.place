import { LatLngLiteral, MapData } from '@/config/maps';
import { useAppDispatch } from '@/redux/hooks';
import { Result } from '@/redux/slices/game';
import React, { useEffect, useRef } from 'react';
import { config } from '../../config/google';
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
    if (!window.__GMAP) {
      const mapDiv = document.getElementById('GMAP')!;
      window.__GMAP = new google.maps.Map(mapDiv);
      console.log('created new map instance');
    }

    window.__GMAP.setOptions({
      ...config.map,
    });
    const sw = new google.maps.LatLng(mapData.computed.bbLiteral.SW);
    const ne = new google.maps.LatLng(mapData.computed.bbLiteral.NE);

    /* Order in constructor is important! SW, NE  */
    const mapBounds = new google.maps.LatLngBounds(sw, ne);

    window.__GMAP.fitBounds(mapBounds, 2);
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
