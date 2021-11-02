import { config } from '@/config/google';
import { MAPS } from '@/config/maps';
import { markers } from '@/config/markers';
import { LatLngLiteral } from '@/config/types';
import { useAppDispatch } from '@/redux/hooks';
import { Result } from '@/redux/slices/game';
import { updateSelectedPosition } from '@/redux/slices/position';
import { Fade } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import { Gmap } from '../../services/google-map';

export enum MapMode {
  PREVIEW,
  PLAY,
  RESULT,
}

export type GoogleMapProps = {
  activeMapId: string;
  mode?: MapMode;
  scores?: (Result & {
    name: string;
  })[];
  initialPos?: LatLngLiteral;
};

const GoogleMap = ({
  mode,
  scores,
  initialPos,
  activeMapId,
}: GoogleMapProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (ref.current) {
      const undoToggle = Gmap.toggle(ref.current);
      return () => {
        undoToggle();
      };
    }
  }, []);

  useEffect(() => {
    Gmap.map.setOptions({
      ...config.map,
    });
    const map = MAPS[activeMapId];
    const sw = new google.maps.LatLng(map.computed.bbLiteral.SW);
    const ne = new google.maps.LatLng(map.computed.bbLiteral.NE);

    /* Order in constructor is important! SW, NE  */
    const mapBounds = new google.maps.LatLngBounds(sw, ne);
    Gmap.map.fitBounds(mapBounds, 2);
  }, [activeMapId]);

  /* If the map is used in preview mode */
  useEffect(() => {
    if (mode === MapMode.PREVIEW) {
      Gmap.map.setOptions({
        ...config.map,
        mapTypeId: 'roadmap',
        mapTypeControl: false,
        gestureHandling: 'none',
      });
      const features = Gmap.map.data.addGeoJson(MAPS[activeMapId].geo);
      Gmap.map.data.setStyle({
        fillColor: '#003d80',
        fillOpacity: 0.2,
        strokeWeight: 0.8,
      });
      return () => {
        features.forEach(feat => {
          Gmap.map?.data.remove(feat);
        });
      };
    }
  }, [mode, activeMapId]);

  /* Map in actual game mode */
  useEffect(() => {
    if (mode === MapMode.PLAY) {
      Gmap.map.setOptions({
        ...config.map,
      });
      const marker = new google.maps.Marker();
      const listener = Gmap.map.addListener(
        'click',
        ({ latLng }: { latLng: google.maps.LatLng }) => {
          marker.setPosition(latLng);
          marker.setMap(Gmap.map!);

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
    if (scores && initialPos && mode === MapMode.RESULT) {
      Gmap.map.setOptions({
        ...config.map,
      });
      const gMarkers: google.maps.Marker[] = [];
      gMarkers.push(
        new window.google.maps.Marker({
          position: initialPos,
          map: Gmap.map,
        })
      );
      scores.forEach((p, idx) => {
        gMarkers.push(
          new window.google.maps.Marker({
            position: p.selected,
            map: Gmap.map,
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
};

export default React.memo(GoogleMap, (prev, curr) => {
  return prev.mode === curr.mode && prev.activeMapId === curr.activeMapId;
});
