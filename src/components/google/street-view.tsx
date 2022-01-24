import {config} from '@/config/google';
import {useAppSelector} from '@/redux/hooks';
import {StreetViewService} from '@/services/google';
import Box, {BoxProps} from '@mui/system/Box';
import {useEffect, useRef} from 'react';

interface GoogleStreetViewProps extends BoxProps {
  staticPos?: boolean;
}

export const GoogleStreetView = ({
  staticPos = false,
  ...rest
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
      {...rest}
      data-testid="play-google-street-view"
      height="100%"
      ref={ref}
    />
  );
};
