import {config} from '@/config/google';
import {LatLngLiteral, MapData} from '@/config/types';
import {Result} from '@/redux/game';
import {useAppDispatch} from '@/redux/hooks';
import {updateSelectedPosition} from '@/redux/position';
import {MapService, MarkerService, PolyLineService} from '@/services/google';
import Box from '@mui/material/Box';
import {useEffect, useRef} from 'react';

type PreviewMode = {
  mode: 'preview';
};

type PlayMode = {
  mode: 'play';
};

type ReviewMode = {
  mode: 'review';
  results: Pick<Result, 'selected' | 'name'>[];
  initialPosition: LatLngLiteral;
};

export type GoogleMapProps = {
  map: MapData;
} & (PreviewMode | PlayMode | ReviewMode | {mode?: never});

export const GoogleMap = (props: GoogleMapProps) => {
  const {map, mode} = props;
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
  }, [ref, map.properties.bbLiteral.NE, map.properties.bbLiteral.SW]);

  useEffect(() => {
    if (mode === 'preview') {
      console.info('%cPREVIEW MODE MOUNT', 'color: yellow');
      MapService.map.setOptions(config.map.preview);

      const features = MapService.map.data.addGeoJson(map);

      MapService.map.data.setStyle({
        fillColor: '#003d80',
        fillOpacity: 0.2,
        strokeWeight: 0.8,
      });
      return () => {
        console.info('%cPREVIEW MODE UNMOUNT', 'color: yellow');
        features.forEach(feat => {
          MapService.map.data.remove(feat);
        });
      };
    }
  }, [mode, map]);

  useEffect(() => {
    if (mode === 'play') {
      console.info('%cPLAY MODE MOUNT', 'color: yellow');
      MapService.map.setOptions(config.map.play);

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
        console.info('%cPLAY MODE UNMOUNT', 'color: yellow');
        listener.remove();
        MarkerService.clearAllItems();
      };
    }
  }, [mode, dispatch]);

  useEffect(() => {
    if (mode === 'review') {
      console.info('%cRESULT MODE MOUNT', 'color: yellow');
      MapService.map.setOptions(config.map.review);

      const {results, initialPosition} = props;

      // Add original location marker
      const originMarker = new google.maps.Marker();

      originMarker.setPosition(initialPosition);
      originMarker.setMap(MapService.map);

      MarkerService.add(originMarker);

      // Add marker for each result
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
              path: config.marker.svg.path,
              fillColor: `#${config.marker.colors[idx]}`,
              fillOpacity: 1,
              anchor: new google.maps.Point(
                config.marker.svg.anchor[0],
                config.marker.svg.anchor[1]
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
            strokeColor: `#${config.marker.colors[idx]}`,
            strokeOpacity: 1.0,
            strokeWeight: 4,
          });
          PolyLineService.add(polyLine);
          MarkerService.add(playerMarker);
        }
      });

      return () => {
        console.info('%cRESULT MODE UNMOUNT', 'color: yellow');
        MarkerService.clearAllItems();
        PolyLineService.clearAllItems();
      };
    }
  }, [mode, props]);

  return <Box data-testid="play-google-map" ref={ref} height="100%" />;
};
