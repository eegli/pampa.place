import CloseIcon from '@mui/icons-material/Close';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {Box, Button, IconButton} from '@mui/material';
import {forwardRef, ReactNode} from 'react';

type MiniMapProps = {
  enlarged: boolean;
  isPositionSelected: boolean;
  successCallback: () => void;
  toggle: () => void;
  children: ReactNode;
};

export const MiniMap = forwardRef<HTMLDivElement, MiniMapProps>(
  function MiniMapWithRef(props, ref) {
    const {enlarged, isPositionSelected, successCallback, toggle, children} =
      props;

    return (
      <Box
        ref={ref}
        id="mini-map"
        role="region"
        position="absolute"
        bottom={50}
        right={30}
        maxHeight="70%"
        maxWidth="85%"
        minHeight="20%"
        minWidth="30%"
        height={enlarged ? 700 : 150}
        width={enlarged ? 700 : 200}
        sx={{
          transition: '0.2s ease',
        }}
        // Display on top of speed dial
        zIndex={1000}
      >
        <IconButton
          aria-label="mini-map open button"
          onClick={toggle}
          size="large"
          sx={{
            position: 'absolute',
            zIndex: 1000,
            display: enlarged ? 'none' : 'block',
            height: '100%',
            width: '100%',
            background:
              'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6))',
            borderRadius: 0,
          }}
        >
          <OpenInNewIcon fontSize="large" />
        </IconButton>
        {children}

        {enlarged ? (
          <>
            <IconButton
              aria-label="mini-map close button"
              onClick={toggle}
              size="large"
              sx={{
                position: 'absolute',
                top: '2%',
                right: '2%',
                background:
                  'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4))',
              }}
            >
              <CloseIcon fontSize="large" />
            </IconButton>
            <Button
              aria-label="location submit button"
              variant="contained"
              color={isPositionSelected ? 'success' : 'secondary'}
              onClick={successCallback}
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
              }}
            >
              {isPositionSelected ? "I'm here!" : 'Place the marker'}
            </Button>
          </>
        ) : null}
      </Box>
    );
  }
);
