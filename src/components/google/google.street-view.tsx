import config from '@config';
import React, { useEffect, useRef } from 'react';
import { useAppSelector } from 'src/redux/hooks';
import { getInitialPosition } from 'src/redux/position';

function GoogleStreetView() {
  const panoRef = useRef<HTMLDivElement>(null);
  const position = useAppSelector(getInitialPosition);

  // Initialization
  useEffect(() => {
    if (panoRef.current && position) {
      new window.google.maps.StreetViewPanorama(panoRef.current, {
        position,
        ...config.defaults.gStreetView,
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
