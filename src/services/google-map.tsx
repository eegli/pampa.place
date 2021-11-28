import {unsafeToggleHTMLElement} from '@/utils/misc';

export const GmapContainer = () => {
  return (
    <div id="__GMAP__CONTAINER__" data-testid="__GMAP__CONTAINER__">
      <div id="__GMAP__" data-testid="__GMAP__" style={{height: '100%'}} />
    </div>
  );
};

export class MapService {
  static _map: google.maps.Map | undefined;
  static markers: google.maps.Marker[] = [];

  static addMarker(m: google.maps.Marker) {
    MapService.markers.push(m);
    return m;
  }
  // https://developers.google.com/maps/documentation/javascript/markers#remove
  static clearMarkers() {
    MapService.markers.forEach(m => m.setMap(null));
    MapService.markers.length = 0;
  }

  static get div() {
    return document.getElementById('__GMAP__')!;
  }
  static get container() {
    return document.getElementById('__GMAP__CONTAINER__')!;
  }

  static get map() {
    if (!MapService._map) {
      MapService._map = new google.maps.Map(MapService.div);
      console.log('%cCreated new global Map instance', 'color: green');
    }
    return MapService._map;
  }

  static mount<T extends HTMLElement>(tempContainer: T) {
    const unmount = unsafeToggleHTMLElement(
      MapService.div,
      MapService.container,
      tempContainer
    );

    return () => {
      unmount();
    };
  }
}
