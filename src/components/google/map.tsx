import {config} from '@/config/google';
import {MAPS} from '@/config/maps';
import {markers as markerConfig} from '@/config/markers';
import {LatLngLiteral} from '@/config/types';
import {Result} from '@/redux/game';
import {useAppDispatch} from '@/redux/hooks';
import {updateSelectedPosition} from '@/redux/position';
import {MapService, MarkerService, PolyLineService} from '@/services/google';
import {useEffect, useRef} from 'react';

export type GoogleMapProps = {
  mapId: string;
  mode?: 'preview' | 'play' | 'result';
  results?: Pick<Result, 'selected' | 'name'>[];
  initialPosition?: LatLngLiteral;
};

export const GoogleMap = ({
  mode,
  mapId,
  results,
  initialPosition,
}: GoogleMapProps) => {
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      const unmount = MapService.mount(ref.current);
      const map = MAPS[mapId];
      /* Order in constructor is important! SW, NE  */
      const bounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(map.bbLiteral.SW),
        new google.maps.LatLng(map.bbLiteral.NE)
      );
      google.maps.event.addListenerOnce(MapService.map, 'idle', () => {
        MapService.map.fitBounds(bounds, 0);
      });

      return () => {
        unmount();
      };
    }
  }, [mapId]);

  useEffect(() => {
    if (mode === 'preview') {
      console.info('PREVIEW MODE MOUNT');
      MapService.map.setOptions({
        ...config.map,
        gestureHandling: 'none',
        mapTypeId: 'roadmap',
        mapTypeControl: false,
      });

      const features = MapService.map.data.addGeoJson(MAPS[mapId].feature);

      MapService.map.data.setStyle({
        fillColor: '#003d80',
        fillOpacity: 0.2,
        strokeWeight: 0.8,
      });
      return () => {
        console.info('PREVIEW MODE UNMOUNT');
        features.forEach(feat => {
          MapService.map.data.remove(feat);
        });
      };
    }
  }, [mode, mapId]);

  useEffect(() => {
    if (mode === 'play') {
      console.info('PLAY MODE MOUNT');
      MapService.map.setOptions(config.map);

      const marker = new google.maps.Marker();
      marker.setMap(MapService.map);
      marker.setDraggable(true);

      MarkerService.add(marker);

      // This Google Map event is not typed unfortunately
      const listener = MapService.map.addListener('click', (e: unknown) => {
        const {latLng} = e as {latLng: google.maps.LatLng};
        marker.setPosition(latLng);
        dispatch(
          updateSelectedPosition({lat: latLng.lat(), lng: latLng.lng()})
        );
      });
      return () => {
        console.info('PLAY MODE UNMOUNT');
        if (listener) listener.remove();
        // https://developers.google.com/maps/documentation/javascript/markers#remove
        MarkerService.clearAllItems();
      };
    }
  }, [mode, dispatch]);

  useEffect(() => {
    if (mode === 'result' && initialPosition) {
      console.info('RESULT MODE MOUNT');
      MapService.map.setOptions(config.map);

      // Add original location marker
      const originMarker = new google.maps.Marker();
      originMarker.setPosition(initialPosition);
      originMarker.setMap(MapService.map);

      MarkerService.add(originMarker);

      // Add marker for each result
      results &&
        results.forEach((p, idx) => {
          if (p.selected) {
            const playerMarker = new google.maps.Marker({
              position: p.selected,
              map: MapService.map,
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
            });

            const polyLine = new google.maps.Polyline({
              path: [initialPosition, p.selected],
              map: MapService.map,
              geodesic: true,
              strokeColor: `#${markerConfig.colors[idx]}`,
              strokeOpacity: 1.0,
              strokeWeight: 4,
            });
            PolyLineService.add(polyLine);
            MarkerService.add(playerMarker);
          }
        });

      return () => {
        console.info('RESULT MODE UNMOUNT');
        MarkerService.clearAllItems();
        PolyLineService.clearAllItems();
      };
    }
  }, [mode, initialPosition, results]);

  return (
    <div
      ref={ref}
      style={{
        height: '100%',
      }}
    />
  );
};
