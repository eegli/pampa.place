import { Box, BoxProps, styled } from '@mui/material';

interface StyledMapOverlayProps extends BoxProps {
  pos: 'left' | 'right';
}
export const StyledMapOverlay = styled(Box)<StyledMapOverlayProps>(
  ({ pos }) => ({
    zIndex: 10,
    position: 'absolute',
    width: '4rem',
    bottom: 35,
    left: pos === 'left' ? 25 : 'auto',
    right: pos === 'right' ? 25 : 'auto',
    '&:hover': {
      cursor: 'pointer',
    },
  })
);
