import {config} from '@/config/google';
import {useAppSelector} from '@/redux/hooks';
import {StreetViewService} from '@/services/google';
import {Fade} from '@mui/material';
import {useEffect, useRef} from 'react';

type GoogleStreetViewProps = {
  staticPos?: boolean;
};

export const GoogleStreetView = ({
  staticPos = false,
}: GoogleStreetViewProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const panoId = useAppSelector(({position}) => position.panoId);

  // Initialization
  useEffect(() => {
    if (ref.current) {
      const unmount = StreetViewService.mount(ref.current);
      return () => {
        unmount();
      };
    }
  }, []);

  useEffect(() => {
    StreetViewService.sv.setPano(panoId);
  }, [panoId]);

  useEffect(() => {
    StreetViewService.sv.setOptions({
      ...config.streetview,
      ...(staticPos && {
        clickToGo: false,
        disableDoubleClickZoom: true,
        disableDefaultUI: true,
      }),
    });
  }, [staticPos]);

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
