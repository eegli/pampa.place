import {CircularProgress} from '@mui/material';
import {SlimContainer} from '../../styles/containers';

export const Spinner = () => {
  return (
    <SlimContainer
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100%"
    >
      <CircularProgress />
    </SlimContainer>
  );
};
