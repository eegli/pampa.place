import { config } from '@/config/google';
import { useAppSelector } from '@/redux/hooks';
import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    __GSTV: google.maps.StreetViewPanorama | undefined;
  }
}

function GoogleStreetView() {
  const ref = useRef<HTMLDivElement>(null);
  const position = useAppSelector(({ position }) => position.initialPosition);

  // Initialization
  useEffect(() => {
    if (!window.__GSTV) {
      const root = document.getElementById('GSTV')!;
      window.__GSTV = new google.maps.StreetViewPanorama(root);
      console.log('created new pano instance');
    }

    if (ref.current) {
      const root = document.getElementById('GSTV')!;

      root.style.height = '100%';
      root.style.width = '100%';
      ref.current.appendChild(root);

      return () => {
        root.style.height = '0';
        root.style.width = '0';
        document.body.appendChild(root);
      };
    }
  }, []);

  useEffect(() => {
    if (window.__GSTV && position) {
      window.__GSTV.setOptions({
        visible: true,
        position,
        ...config.streetview,
      });

      return () => {
        if (window.__GSTV) {
          window.__GSTV.setVisible(false);
        }
      };
    }
  }, [position]);

  return (
    <div
      ref={ref}
      style={{
        height: '100%',
        width: '100%',
      }}
    />
  );
}
export default GoogleStreetView;
