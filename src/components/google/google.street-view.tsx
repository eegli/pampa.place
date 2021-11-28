import {config} from '@/config/google';
import {useAppSelector} from '@/redux/redux.hooks';
import {Fade} from '@mui/material';
import React, {useEffect, useRef} from 'react';
import {Gstv} from '../../services/google-sv';

type GoogleStreetViewProps = {
  staticPos?: boolean;
};

const GoogleStreetView = ({staticPos = false}: GoogleStreetViewProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const panoId = useAppSelector(({position}) => position.panoId);

  // Initialization
  useEffect(() => {
    if (ref.current) {
      const unmount = Gstv.mount(ref.current);
      return () => {
        unmount();
      };
    }
  }, []);

  useEffect(() => {
    Gstv.sv.setPano(panoId);

    let opts = config.streetview;

    if (staticPos) {
      opts = {
        ...opts,
        clickToGo: false,
        disableDoubleClickZoom: true,
        disableDefaultUI: true,
      };
    }
    Gstv.sv.setOptions(opts);
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
