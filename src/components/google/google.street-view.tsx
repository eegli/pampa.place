import defaults from '@config/defaults';
import React, { useEffect, useRef } from 'react';
import { useAppSelector } from '../../redux/hooks';

function GoogleStreetView() {
  const panoRef = useRef<HTMLDivElement>(null);
  const position = useAppSelector(({ position }) => position.initialPosition);

  // Initialization
  useEffect(() => {
    if (panoRef.current && position) {
      new window.google.maps.StreetViewPanorama(panoRef.current, {
        position,
        ...defaults.gStreetView,
      });
    }
  }, [panoRef, position]);

  useEffect(() => {
    console.count('street view');
  }, []);

  return (
    <div
      ref={panoRef}
      style={{
        height: '100%',
        width: '100%',
      }}
    />
  );
}
export default GoogleStreetView;
