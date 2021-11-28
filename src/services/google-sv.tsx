import {unsafeToggleHTMLElement} from '@/utils/misc';

export const GstvContainer = () => {
  return (
    <div id="__GSTV__CONTAINER__" data-testid="__GSTV__CONTAINER__">
      <div id="__GSTV__" data-testid="__GSTV__" style={{height: '100%'}} />
    </div>
  );
};

export class StreetViewService {
  static get div() {
    return document.getElementById('__GSTV__')!;
  }
  static get container() {
    return document.getElementById('__GSTV__CONTAINER__')!;
  }
  private static _sv: google.maps.StreetViewPanorama | undefined;

  static get sv() {
    if (!StreetViewService._sv) {
      StreetViewService._sv = new google.maps.StreetViewPanorama(
        StreetViewService.div
      );
      console.log('%cCreated new global Street View instance', 'color: green');
    }
    return StreetViewService._sv;
  }

  static mount<T extends HTMLElement>(tempContainer: T) {
    const unmount = unsafeToggleHTMLElement(
      StreetViewService.div,
      StreetViewService.container,
      tempContainer
    );
    return () => {
      unmount();
    };
  }
}
