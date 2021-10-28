import { config } from '@/config/google';
import { useAppSelector } from '@/redux/hooks';
import { unsafeToggleHTMLElement } from '@/utils/misc';
import { Fade } from '@mui/material';
import React, { useEffect, useRef } from 'react';

export const GoogleSVRoot = () => {
  return (
    <div id="__GSTV__CONTAINER__">
      <div id="__GSTV__" style={{ height: '100%' }} />
    </div>
  );
};

type GoogleStreetViewProps = {
  staticPos: boolean;
};

export let GLOBAL_SV: google.maps.StreetViewPanorama | undefined;

const GoogleStreetView = ({ staticPos = false }: GoogleStreetViewProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const panoId = useAppSelector(({ position }) => position.panoId);

  // Initialization
  useEffect(() => {
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

  useEffect(() => {
    if (GLOBAL_SV && panoId) {
      GLOBAL_SV.setPano(panoId);
      GLOBAL_SV.setOptions({
        ...config.streetview,
      });
      // Don't allow movement
      if (staticPos) {
        GLOBAL_SV.setOptions({
          clickToGo: false,
          disableDoubleClickZoom: true,
        });
      }
    }
  }, [panoId, staticPos]);

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
