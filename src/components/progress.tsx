import { Box, LinearProgress } from '@mui/material';
import { useAppSelector } from '../redux/hooks';

export default function LoadingProgress() {
  const loading = useAppSelector(s => s.position.loading);
  return loading ? (
    <Box position="absolute" width="100%">
      <LinearProgress />
    </Box>
  ) : (
    <div />
  );
}
