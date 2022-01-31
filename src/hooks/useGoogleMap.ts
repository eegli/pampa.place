import {RefObject, useEffect} from 'react';
import {LatLngLiteral} from '../config/types';
import {MapService} from '../services/google';

type CenterProps = {
  center: google.maps.LatLng | google.maps.LatLngLiteral;
  zoom: number;
};

type BoundsProps = {
  SW: LatLngLiteral;
  NE: LatLngLiteral;
};

type Props = {ref: RefObject<HTMLDivElement>; opts?: google.maps.MapOptions} & (
  | CenterProps
  | BoundsProps
);

export function useGoogleMap(props: Props) {
  const {ref, ...rest} = props;

  useEffect(() => {
    if (ref.current) {
      console.info('MAP MOUNT');
      const unmount = MapService.mount(ref.current);

      if ('center' in rest) {
        MapService.map.setCenter({lat: 35, lng: 0});
        MapService.map.setZoom(3);
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
        console.info('MAP UNMOUNT');
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
