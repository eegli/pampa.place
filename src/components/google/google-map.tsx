import {MapService} from '@/services/google';
import Box from '@mui/material/Box';
import {memo, ReactNode, useEffect, useRef} from 'react';

type BoundsProps = {
  bounds: {
    SW: google.maps.LatLngLiteral;
    NE: google.maps.LatLngLiteral;
  };
  padding?: number;
};

type CenterProps = {
  center: google.maps.LatLngLiteral;
  zoom?: number;
};

export type GoogleMapProps = {
  id?: string;
  children?: ReactNode;
  onMount?: (map: google.maps.Map) => unknown;
  onUnmount?: (map: google.maps.Map) => unknown;
} & (BoundsProps | CenterProps);

const _GoogleMap = ({
  children,
  id = 'google-map',
  onMount,
  onUnmount,
  ...rest
}: GoogleMapProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      const unmountMap = MapService.mount(ref.current);
      console.info('%cGOOGLE MAP MOUNT', 'color: yellow');

      if ('bounds' in rest) {
        /* Order in constructor is important! SW, NE  */
        const bounds = new google.maps.LatLngBounds(
          rest.bounds.SW,
          rest.bounds.NE
        );
        google.maps.event.addListenerOnce(MapService.map, 'idle', () => {
          MapService.map.fitBounds(bounds, rest.padding || 0);
        });
      } else {
        MapService.map.setCenter(rest.center);
        MapService.map.setZoom(rest.zoom || 0);
      }

      if (typeof onMount === 'function') {
        onMount(MapService.map);
      }

      return () => {
        // Any cleanup logic
        if (typeof onUnmount === 'function') {
          onUnmount(MapService.map);
        }

        unmountMap();
        console.info('%cGOOGLE MAP UNMOUNT', 'color: yellow');
      };
    }
  }, [ref, onMount, onUnmount, rest]);

  return (
    <Box id={id} data-testid={id} ref={ref} height="100%" width="100%">
      {children}
    </Box>
  );
};

export const GoogleMap = memo(_GoogleMap, (prev, next) => prev.id === next.id);
