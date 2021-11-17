import {config} from '@/config/google';
import {MAPS} from '@/config/maps';
import {markers} from '@/config/markers';
import {LatLngLiteral} from '@/config/types';
import {updateSelectedPosition} from '@/redux/position/position.slice';
import {useAppDispatch} from '@/redux/redux.hooks';
import {Fade} from '@mui/material';
import React, {useEffect, useRef} from 'react';
import {Result} from '../../redux/game/game.slice';
import {Gmap} from '../../services/google-map';

export enum MapMode {
  PREVIEW,
  PLAY,
  RESULT,
}

export type GoogleMapProps = {
  activeMapId: string;
  mode?: MapMode;
  scores?: Result[];
  initialPos?: LatLngLiteral;
};

const GoogleMap = ({mode, scores, initialPos, activeMapId}: GoogleMapProps) => {
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
    const sw = new google.maps.LatLng(map.bbLiteral.SW);
    const ne = new google.maps.LatLng(map.bbLiteral.NE);

    /* Order in constructor is important! SW, NE  */
    const mapBounds = new google.maps.LatLngBounds(sw, ne);
    Gmap.map.fitBounds(mapBounds, 2);
  }, [activeMapId]);

  useEffect(() => {
    switch (mode) {
      case MapMode.PREVIEW:
        console.log('PREVIEW');
        Gmap.map.setOptions({
          ...config.map,
          mapTypeId: 'roadmap',
          mapTypeControl: false,
          gestureHandling: 'none',
        });
        const features = Gmap.map.data.addGeoJson(MAPS[activeMapId].feature);
        Gmap.map.data.setStyle({
          fillColor: '#003d80',
          fillOpacity: 0.2,
          strokeWeight: 0.8,
        });
        return () => {
          console.log('PREVIEW UNMOUNT');
          features.forEach(feat => {
            Gmap.map.data.remove(feat);
          });
        };
      case MapMode.PLAY:
        console.log('PLAY');
        Gmap.map.setOptions({
          ...config.map,
        });
        let marker: google.maps.Marker | null = new google.maps.Marker({
          draggable: true,
          map: Gmap.map,
        });

        Gmap.map.addListener(
          'click',
          ({latLng}: {latLng: google.maps.LatLng}) => {
            if (marker) {
              marker.setPosition(latLng);
              dispatch(
                updateSelectedPosition({lat: latLng.lat(), lng: latLng.lng()})
              );
            }
          }
        );

        return () => {
          console.log('PLAY UNMOUNT');
          google.maps.event.clearInstanceListeners(Gmap.map);
          marker?.setMap(null);
          marker = null;
        };
      case MapMode.RESULT:
        console.log('RESULT');
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
        scores &&
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
          console.log('RESULT UNMOUNT');
          // https://developers.google.com/maps/documentation/javascript/markers#remove
          gMarkers.forEach(marker => marker.setMap(null));
          gMarkers.length = 0;
        };
    }
  }, [mode, activeMapId, scores, initialPos, dispatch]);

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
