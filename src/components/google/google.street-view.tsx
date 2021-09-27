import { config } from '@/config/google';
import { useAppSelector } from '@/redux/hooks';
import React, { useEffect, useRef } from 'react';

function GoogleStreetView() {
  const panoRef = useRef<HTMLDivElement>(null);
  const position = useAppSelector(({ position }) => position.initialPosition);

  // Initialization
  useEffect(() => {
    if (panoRef.current && position) {
      new window.google.maps.StreetViewPanorama(panoRef.current, {
        position,
        ...config.streetview,
      });
    }
  }, [panoRef, position]);

  useEffect(() => {
    console.count('street view');
  }, []);

  return (
    <div
      /*  ref={panoRef} */
      style={{
        backgroundColor: '#f51b51',
        height: '100%',
        width: '100%',
      }}
    />
  );
}
export default GoogleStreetView;
