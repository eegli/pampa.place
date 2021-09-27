import { Box, BoxProps } from '@mui/system';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps extends BoxProps {
  id?: string;
}

const MapPortal: React.FC<PortalProps> = ({ children, id, ...rest }) => {
  const ref = useRef<HTMLDivElement>(null);
  const portal = document.getElementById('map-portal')!;
  useEffect(() => {
    if (ref.current) {
      const portal = document.getElementById('map-portal')!;
      const size = ref.current.getBoundingClientRect();
      console.log('size', size);
      portal.style.position = 'absolute';
      portal.style.height = size.height.toString();
      portal.style.width = size.width.toString();

      portal.style.top = size.top.toString();
      portal.style.left = size.left.toString();
      portal.style.right = size.right.toString();
      portal.style.bottom = size.bottom.toString();
    }

    return () => {
      const portal = document.getElementById('map-portal')!;
      portal.style.height = '0';
    };
  }, []);

  return createPortal(
    <div
      ref={ref}
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <Box {...rest}>{children}</Box>
    </div>,
    portal
  );
};

export default MapPortal;
