import {MapService} from '@/services/google';
import Box from '@mui/material/Box';
import {ReactNode, useEffect, useRef} from 'react';

type InstanceMethods = Omit<
  InstanceType<typeof google.maps.Map>,
  'setCenter' | 'fitBounds'
>;

export type GoogleMapContainerProps = {
  children: ReactNode;
  onMount?: (map: InstanceMethods) => unknown;
  onUnmount?: (map: InstanceMethods) => unknown;
} & (
  | {
      bounds: google.maps.LatLngLiteral;
      padding?: number;
    }
  | {
      center: google.maps.LatLngLiteral;
      zoom?: number;
    }
);

export const GoogleMapContainer = ({
  children,
  onMount,
  onUnmount,
  ...rest
}: GoogleMapContainerProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      const unmount = MapService.mount(ref.current);

      if ('bounds' in rest) {
        /* Order in constructor is important! SW, NE  */
        const bounds = new google.maps.LatLngBounds(rest.bounds);
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
        if (typeof onUnmount === 'function') {
          onUnmount(MapService.map);
        }
        unmount();
      };
    }
  }, [ref, onMount, onUnmount, rest]);

  return (
    <>
      <Box data-testid="play-google-map" ref={ref} height="100%" width="100%" />
      {children}
    </>
  );
};
