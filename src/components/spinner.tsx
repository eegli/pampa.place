import { CircularProgress } from '@mui/material';
import { SlimContainer } from '../styles/containers';

const Spinner = () => {
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
export default Spinner;
