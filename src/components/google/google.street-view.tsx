import { config } from '@/config/google';
import { useAppSelector } from '@/redux/hooks';
import { unsafeToggleHTMLElement } from '@/utils/misc';
import { Fade } from '@mui/material';
import React, { useRef } from 'react';
import { useIsomorphicLayoutEffect } from 'react-use';

export const GoogleSVRoot = () => {
  return (
    <div id="__GSTV__CONTAINER__">
      <div id="__GSTV__" style={{ height: '100%' }} />
    </div>
  );
};

export let GLOBAL_SV: google.maps.StreetViewPanorama | undefined;

const GoogleStreetView = () => {
  const ref = useRef<HTMLDivElement>(null);
  const panoId = useAppSelector(({ position }) => position.panoId);

  // Initialization
  useIsomorphicLayoutEffect(() => {
    const svDiv = document.getElementById('__GSTV__')!;
    const parking = document.getElementById('__GSTV__CONTAINER__')!;

    if (!GLOBAL_SV) {
      GLOBAL_SV = new google.maps.StreetViewPanorama(svDiv);
      console.log('Created new global SV instance');
    }

    if (ref.current) {
      const undoToggle = unsafeToggleHTMLElement(svDiv, parking, ref.current);
      return () => {
        undoToggle();
      };
    }
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (GLOBAL_SV && panoId) {
      GLOBAL_SV.setPano(panoId);
      GLOBAL_SV.setOptions({
        ...config.streetview,
      });
    }
  }, [panoId]);

  return (
    <Fade in timeout={500}>
      <div
        ref={ref}
        style={{
          height: '100%',
          width: '100%',
        }}
      />
    </Fade>
  );
};
export default GoogleStreetView;
