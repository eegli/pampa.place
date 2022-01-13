import {svgMarker, svgMarkerColors} from '@/components/google/marker';
import {config} from '@/config/google';
import {LatLngLiteral, MapData} from '@/config/types';
import {Result} from '@/redux/game';
import {useAppDispatch} from '@/redux/hooks';
import {updateSelectedPosition} from '@/redux/position';
import {MapService, MarkerService, PolyLineService} from '@/services/google';
import {useEffect, useRef} from 'react';

export type GoogleMapProps = {
  map: MapData;
  mode?: 'preview' | 'play' | 'result';
  results?: Pick<Result, 'selected' | 'name'>[];
  initialPosition?: LatLngLiteral;
};

export const GoogleMap = ({
  map,
  mode,
  results,
  initialPosition,
}: GoogleMapProps) => {
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      const unmount = MapService.mount(ref.current);
      /* Order in constructor is important! SW, NE  */
      const bounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(map.properties.bbLiteral.SW),
        new google.maps.LatLng(map.properties.bbLiteral.NE)
      );
      google.maps.event.addListenerOnce(MapService.map, 'idle', () => {
        MapService.map.fitBounds(bounds, 0);
      });

      return () => {
        unmount();
      };
    }
  }, [map]);

  useEffect(() => {
    if (mode === 'preview') {
      console.info('PREVIEW MODE MOUNT');
      MapService.map.setOptions({
        ...config.map,
        gestureHandling: 'none',
        mapTypeId: 'roadmap',
        mapTypeControl: false,
      });

      const features = MapService.map.data.addGeoJson(map);

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
  }, [mode, map]);

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
                path: svgMarker.path,
                fillColor: `#${svgMarkerColors[idx]}`,
                fillOpacity: 1,
                anchor: new google.maps.Point(
                  svgMarker.anchor[0],
                  svgMarker.anchor[1]
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
              strokeColor: `#${svgMarkerColors[idx]}`,
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
