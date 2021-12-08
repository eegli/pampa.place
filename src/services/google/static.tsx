import {unsafeToggleHTMLElement} from '@/utils/misc';
import {GoogleDOMIds} from './dom';

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
  static mount(tempContainer: HTMLElement) {
    const unmount = unsafeToggleHTMLElement(
      document.getElementById(GoogleDOMIds.MAP_DIV)!,
      document.getElementById(GoogleDOMIds.MAP_CONTAINER)!,
      tempContainer
    );

    return () => {
      unmount();
    };
  }
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

  static mount(tempContainer: HTMLElement) {
    const unmount = unsafeToggleHTMLElement(
      document.getElementById(GoogleDOMIds.STV_DIV)!,
      document.getElementById(GoogleDOMIds.STV_CONTAINER)!,
      tempContainer
    );

    return () => {
      unmount();
    };
  }
}

class GoogleStaticFactory<T> {
  private instance: T | undefined;
  constructor(
    private divId: string,
    private containerId: string,
    private factory: new (...args: any[]) => T,
    private instanceName?: string
  ) {
    this.instanceName = instanceName || 'google object';
  }
  get it() {
    if (!this.instance) {
      this.instance = new this.factory(document.getElementById(this.divId)!);
      console.log(
        `%cCreated new global ${this.instanceName} instance', 'color: green`
      );
    }
    return this.instance;
  }
}
