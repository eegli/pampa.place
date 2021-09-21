import React, { useEffect, useRef } from 'react';
import config, { MapLatLng } from '../../config';

type StreetViewProps = {
  position: MapLatLng;
};

function GoogleStreetView({ position }: StreetViewProps) {
  const panoRef = useRef<HTMLDivElement>(null);

  // Initialization
  useEffect(() => {
    if (panoRef.current) {
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

export default React.memo(GoogleStreetView, (prev, curr) => {
  return (
    prev.position.lat === curr.position.lat &&
    prev.position.lng === curr.position.lng
  );
});
