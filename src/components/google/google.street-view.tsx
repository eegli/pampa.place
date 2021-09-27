import { config } from '@/config/google';
import { useAppSelector } from '@/redux/hooks';
import { toggleDOMNode } from '@/utils/misc';
import { Fade } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import { DomNodeIds } from '../../pages/_document';

let GLOBAL_STREET_VIEW: google.maps.StreetViewPanorama | undefined;

function GoogleStreetView() {
  const ref = useRef<HTMLDivElement>(null);
  const position = useAppSelector(({ position }) => position.initialPosition);

  // Initialization
  useEffect(() => {
    const streetViewDiv = document.getElementById(
      DomNodeIds.GOOGLE_STREET_VIEW
    )!;

    if (!GLOBAL_STREET_VIEW) {
      GLOBAL_STREET_VIEW = new google.maps.StreetViewPanorama(streetViewDiv);
      console.log('Created new Street View instance');
    }

    if (ref.current) {
      const detach = toggleDOMNode(streetViewDiv, ref.current);
      return () => detach();
    }
  }, []);

  useEffect(() => {
    if (GLOBAL_STREET_VIEW && position) {
      GLOBAL_STREET_VIEW.setOptions({
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
}
export default GoogleStreetView;
