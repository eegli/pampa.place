import {config} from '@/config/google';
import {useAppSelector} from '@/redux/hooks';
import {StreetViewService} from '@/services/google';
import Box from '@mui/system/Box';
import {memo, useEffect, useRef} from 'react';

interface GoogleStreetViewProps {
  staticPos?: boolean;
  display?: 'block' | 'none';
}

export const GoogleStreetView = memo(function GoogleStreetView({
  staticPos = false,
  display = 'block',
}: GoogleStreetViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const panoId = useAppSelector(({position}) => position.panoId);

  // Initialization
  useEffect(() => {
    if (ref.current) {
      console.info('%cGOOGLE STREET VIEW MOUNT', 'color: yellow');
      const unmount = StreetViewService.mount(ref.current);
      return () => {
        unmount();
        console.info('%cGOOGLE STREET VIEW UNMOUNT', 'color: yellow');
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
});
