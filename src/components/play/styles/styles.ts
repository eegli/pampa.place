import Box, {BoxProps} from '@mui/material/Box';
import {styled} from '@mui/material/styles';

interface StyledMapOverlayProps extends BoxProps {
  pos: 'map' | 'submit';
}
export const StyledMapOverlay = styled(Box)<StyledMapOverlayProps>(({pos}) => ({
  zIndex: 10,
  position: 'fixed',
  width: '4rem',
  bottom: pos === 'map' ? 40 : 130,
  right: pos === 'map' ? 70 : 90,
  '&:hover': {
    cursor: 'pointer',
  },
}));
