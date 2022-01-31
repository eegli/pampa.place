import {RefObject, useEffect} from 'react';
import {LatLngLiteral} from '../config/types';
import {MapService} from '../services/google';

type CenterProps = {
  center: google.maps.LatLng | google.maps.LatLngLiteral;
  zoom?: number;
};

type BoundsProps = {
  SW: LatLngLiteral;
  NE: LatLngLiteral;
};

type Props = {ref: RefObject<HTMLDivElement>; opts?: google.maps.MapOptions} & (
  | CenterProps
  | BoundsProps
);

// TODO make this work
export function useGoogleMap(props: Props) {
  const {ref, ...rest} = props;

  useEffect(() => {
    if (ref.current) {
      console.info('%cMAP MOUNT', 'color: yellow');
      const unmount = MapService.mount(ref.current);

      if ('center' in rest) {
        MapService.map.setCenter(rest.center);
        MapService.map.setZoom(rest.zoom || 3);
      } else {
        /* Order in constructor is important! SW, NE  */
        const bounds = new google.maps.LatLngBounds(
          new google.maps.LatLng(rest.SW),
          new google.maps.LatLng(rest.NE)
        );
        google.maps.event.addListenerOnce(MapService.map, 'idle', () => {
          MapService.map.fitBounds(bounds, 0);
        });
      }

      return () => {
        unmount();
        console.info('%cMAP UNMOUNT', 'color: yellow');
      };
    }
  }, [ref, rest]);
}
