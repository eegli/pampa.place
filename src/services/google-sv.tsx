import {unsafeToggleHTMLElement} from '@/utils/misc';

export const GstvContainer = () => {
  return (
    <div id="__GSTV__CONTAINER__" data-testid="__GSTV__CONTAINER__">
      <div id="__GSTV__" style={{height: '100%'}} />
    </div>
  );
};

export class Gstv {
  static get div() {
    return document.getElementById('__GSTV__')!;
  }
  static get container() {
    return document.getElementById('__GSTV__CONTAINER__')!;
  }
  private static _stv: google.maps.StreetViewPanorama | undefined;

  static get stv() {
    if (!Gstv._stv) {
      Gstv._stv = new google.maps.StreetViewPanorama(Gstv.div);
      console.log('%cCreated new global Street View instance', 'color: green');
    }
    return Gstv._stv;
  }

  static toggle<T extends HTMLElement>(tempContainer: T) {
    const undo = unsafeToggleHTMLElement(
      Gstv.div,
      Gstv.container,
      tempContainer
    );
    return () => {
      undo();
    };
  }
}
