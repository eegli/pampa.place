import { Box, BoxProps, styled } from '@mui/material';

interface StyledMapOverlayProps extends BoxProps {
  pos: 'map' | 'submit';
}
export const StyledMapOverlay = styled(Box)<StyledMapOverlayProps>(
  ({ pos }) => ({
    zIndex: 10,
    position: 'fixed',
    width: '4rem',
    bottom: pos === 'map' ? 40 : 130,
    right: pos === 'map' ? 70 : 90,
    '&:hover': {
      cursor: 'pointer',
    },
  })
);
