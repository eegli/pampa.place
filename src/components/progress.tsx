import { useAppSelector } from '@/redux/hooks';
import { Box, LinearProgress } from '@mui/material';

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
