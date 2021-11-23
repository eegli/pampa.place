import {unsafeToggleHTMLElement} from '@/utils/misc';

export const GmapContainer = () => {
  return (
    <div id="__GMAP__CONTAINER__" data-testid="__GMAP__CONTAINER__">
      <div id="__GMAP__" data-testid="__GMAP__" style={{height: '100%'}} />
    </div>
  );
};

export class Gmap {
  static _map: google.maps.Map | undefined;

  static get div() {
    return document.getElementById('__GMAP__')!;
  }
  static get container() {
    return document.getElementById('__GMAP__CONTAINER__')!;
  }

  static get map() {
    if (!Gmap._map) {
      Gmap._map = new google.maps.Map(Gmap.div);
      console.log('%cCreated new global Map instance', 'color: green');
    }
    return Gmap._map;
  }

  static mount<T extends HTMLElement>(tempContainer: T) {
    const unmount = unsafeToggleHTMLElement(
      Gmap.div,
      Gmap.container,
      tempContainer
    );

    return () => {
      unmount();
    };
  }
}
