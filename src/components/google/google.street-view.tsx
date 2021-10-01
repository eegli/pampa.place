import { config } from '@/config/google';
import { useAppSelector } from '@/redux/hooks';
import { unsafeToggleHTMLElement } from '@/utils/misc';
import { Fade } from '@mui/material';
import React, { useEffect, useRef } from 'react';

export const GoogleSVRoot = () => {
  return (
    <div
      id="__GSTV__"
      style={{ width: '100%', height: '100%', display: 'none' }}
    />
  );
};

export let GLOBAL_SV: google.maps.StreetViewPanorama | undefined;

const GoogleStreetView = () => {
  const ref = useRef<HTMLDivElement>(null);
  const position = useAppSelector(({ position }) => position.initialPosition);

  // Initialization
  useEffect(() => {
    const svContainer = document.getElementById('__GSTV__')!;

    if (!GLOBAL_SV) {
      GLOBAL_SV = new google.maps.StreetViewPanorama(svContainer);
      console.log('Created new global SV instance');
    }

    if (ref.current) {
      const undoToggle = unsafeToggleHTMLElement(svContainer, ref.current);
      return () => {
        undoToggle();
      };
    }
  }, []);

  useEffect(() => {
    if (GLOBAL_SV && position) {
      GLOBAL_SV.setOptions({
        position,
        ...config.streetview,
      });
    }
  }, [position]);

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
