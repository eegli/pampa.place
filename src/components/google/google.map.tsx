import {config} from '@/config/google';
import {MAPS} from '@/config/maps';
import {markers as markerConfig} from '@/config/markers';
import {LatLngLiteral} from '@/config/types';
import {Result} from '@/redux/game/game.slice';
import {updateSelectedPosition} from '@/redux/position/position.slice';
import {useAppDispatch, useAppSelector} from '@/redux/redux.hooks';
import React, {useEffect, useRef} from 'react';
import {Gmap} from '../../services/google-map';

export enum MapMode {
  PREVIEW,
  PLAY,
  RESULT,
}

export type GoogleMapProps = {
  mode?: MapMode;
  results?: Result[];
  initialPos?: LatLngLiteral;
};

const GoogleMap = ({mode, results, initialPos}: GoogleMapProps) => {
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLDivElement>(null);
  const activeMapId = useAppSelector(({game}) => game.mapId);

  useEffect(() => {
    if (ref.current) {
      const unmount = Gmap.mount(ref.current);
      const map = MAPS[activeMapId];
      /* Order in constructor is important! SW, NE  */
      const mapBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(map.bbLiteral.SW),
        new google.maps.LatLng(map.bbLiteral.NE)
      );

      google.maps.event.addListenerOnce(Gmap.map, 'idle', () => {
        Gmap.map.fitBounds(mapBounds);
      });
      Gmap.map.setOptions(config.map);
      return () => {
        unmount();
      };
    }
  }, [activeMapId]);

  useEffect(() => {
    if (mode === MapMode.PREVIEW) {
      console.log('PREVIEW MODE MOUNT');
      Gmap.map.setOptions({
        mapTypeId: 'roadmap',
        mapTypeControl: false,
      });
      const features = Gmap.map.data.addGeoJson(MAPS[activeMapId].feature);
      Gmap.map.data.setStyle({
        fillColor: '#003d80',
        fillOpacity: 0.2,
        strokeWeight: 0.8,
      });
      return () => {
        console.log('PREVIEW MODE UNMOUNT');
        features.forEach(feat => {
          Gmap.map.data.remove(feat);
        });
      };
    }
  }, [mode, activeMapId]);

  useEffect(() => {
    if (mode === MapMode.PLAY) {
      console.log('PLAY MODE MOUNT');
      const markers = [
        new google.maps.Marker({
          draggable: true,
          map: Gmap.map,
        }),
      ];
      Gmap.map.addListener(
        'click',
        ({latLng}: {latLng: google.maps.LatLng}) => {
          markers[0].setPosition(latLng);
          dispatch(
            updateSelectedPosition({lat: latLng.lat(), lng: latLng.lng()})
          );
        }
      );
      return () => {
        console.log('PLAY MODE UNMOUNT');
        google.maps.event.clearInstanceListeners(Gmap.map);
        markers[0].setMap(null);
        markers.length = 0;
      };
    }
  }, [mode, dispatch]);

  useEffect(() => {
    if (mode === MapMode.RESULT && results) {
      console.log('RESULT MODE MOUNT');
      const markers: google.maps.Marker[] = [];
      markers.push(
        new window.google.maps.Marker({
          position: initialPos,
          map: Gmap.map,
        })
      );
      results.forEach((p, idx) => {
        markers.push(
          new window.google.maps.Marker({
            position: p.selected,
            map: Gmap.map,

            label: {
              text: p.name,
              color: 'white',
              className: 'map-marker',
            },
            icon: {
              path: markerConfig.marker.path,
              fillColor: `#${markerConfig.colors[idx]}`,
              fillOpacity: 1,
              anchor: new google.maps.Point(
                markerConfig.marker.anchor[0],
                markerConfig.marker.anchor[1]
              ),
              strokeWeight: 0,
              scale: 1,
              labelOrigin: new google.maps.Point(15, 60),
            },
          })
        );
      });

      return () => {
        console.log('RESULT MODE UNMOUNT');
        // https://developers.google.com/maps/documentation/javascript/markers#remove
        markers.forEach(marker => marker.setMap(null));
        markers.length = 0;
      };
    }
  }, [mode, initialPos, results]);

  return (
    <div
      ref={ref}
      style={{
        height: '100%',
      }}
    />
  );
};

export default GoogleMap;
