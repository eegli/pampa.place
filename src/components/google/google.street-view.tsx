import { config } from '@/config/google';
import { useAppSelector } from '@/redux/hooks';
import { Fade } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import { DomNodeIds } from '../../pages/_document';

export let GLOBAL_SV: google.maps.StreetViewPanorama | undefined;

function GoogleStreetView() {
  const ref = useRef<HTMLDivElement>(null);
  const position = useAppSelector(({ position }) => position.initialPosition);

  // Initialization
  useEffect(() => {
    const streetViewDiv = document.getElementById(
      DomNodeIds.GOOGLE_STREET_VIEW
    )!;
    console.log(streetViewDiv);

    if (!GLOBAL_SV) {
      GLOBAL_SV = new google.maps.StreetViewPanorama(streetViewDiv);
      console.log('Created new Street View instance');
    }

    if (ref.current) {
      streetViewDiv.style.display = 'block';
      ref.current.appendChild(streetViewDiv);

      return () => {
        streetViewDiv.style.display = 'none';
        document.body.appendChild(streetViewDiv);
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
}
export default GoogleStreetView;
