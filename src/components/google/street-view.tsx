import {config} from '@/config/google';
import {useAppSelector} from '@/redux/hooks';
import {StreetViewService} from '@/services/google';
import Box from '@mui/system/Box';
import {useEffect, useRef} from 'react';

interface GoogleStreetViewProps {
  staticPos?: boolean;
  display: 'block' | 'none';
}

export const GoogleStreetView = ({
  staticPos = false,
  display,
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
    <Box
      display={display}
      data-testid="play-google-street-view"
      height="100%"
      ref={ref}
    />
  );
};
