/* eslint-disable @typescript-eslint/no-non-null-assertion */

import {GoogleDOMIds} from './dom';

const mountFactory =
  (elemId: string, containerId: string) => (temp: HTMLElement) => {
    const element = document.getElementById(elemId)!;
    const container = document.getElementById(containerId)!;
    temp.appendChild(element);
    return () => {
      container.appendChild(element);
    };
  };

export class MapService {
  private static _map: google.maps.Map | undefined;
  static get map() {
    if (!this._map) {
      this._map = new google.maps.Map(
        document.getElementById(GoogleDOMIds.MAP_DIV)!
      );
      console.info('%cCreated new global Map instance', 'color: green');
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
      console.info('%cCreated new global Street View instance', 'color: green');
    }
    return this._sv;
  }
  static mount = mountFactory(GoogleDOMIds.STV_DIV, GoogleDOMIds.STV_CONTAINER);
}
