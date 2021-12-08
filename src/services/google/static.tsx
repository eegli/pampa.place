import {unsafeToggleHTMLElement} from '@/utils/misc';
import {GoogleDOMIds} from './dom';

function mountFactory(originDiv: string, originContainer: string) {
  return function (tempContainer: HTMLElement) {
    const unmount = unsafeToggleHTMLElement(
      document.getElementById(originDiv)!,
      document.getElementById(originContainer)!,
      tempContainer
    );

    return () => {
      unmount();
    };
  };
}

export class MapService {
  private static _map: google.maps.Map | undefined;
  static get map() {
    if (!this._map) {
      this._map = new google.maps.Map(
        document.getElementById(GoogleDOMIds.MAP_DIV)!
      );
      console.log('%cCreated new global Map instance', 'color: green');
    }
    return this._map;
  }
  static mount = mountFactory(GoogleDOMIds.MAP_DIV, GoogleDOMIds.MAP_CONTAINER);
}

export class StreetViewService {
  private static _sv: google.maps.StreetViewPanorama | undefined;
  static get sv() {
    if (!this._sv) {
      this._sv = new google.maps.StreetViewPanorama(
        document.getElementById(GoogleDOMIds.STV_DIV)!
      );
      console.log('%cCreated new global Street View instance', 'color: green');
    }
    return this._sv;
  }
  static mount = mountFactory(GoogleDOMIds.STV_DIV, GoogleDOMIds.STV_CONTAINER);
}
