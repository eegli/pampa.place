import { config } from '@/config/google';
import { useAppSelector } from '@/redux/hooks';
import { Fade } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import { GLOBAL_SV } from '../../pages/_app';

const GoogleStreetView = () => {
  const ref = useRef<HTMLDivElement>(null);
  const position = useAppSelector(({ position }) => position.initialPosition);

  // Initialization
  useEffect(() => {
    const streetViewDiv = document.getElementById('__GSTV__')!;

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
    if (position) {
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
