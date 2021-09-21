import { CircularProgress } from '@mui/material';
import { SlimContainer } from '../styles';

export default function Spinner() {
  return (
    <SlimContainer margin='auto'>
      <CircularProgress />
    </SlimContainer>
  );
}
