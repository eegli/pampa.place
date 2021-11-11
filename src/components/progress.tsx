import {useAppSelector} from '@/redux/redux.hooks';
import {Box, LinearProgress} from '@mui/material';

const LoadingProgress = () => {
  const loading = useAppSelector(s => s.position.loading);
  return loading ? (
    <Box position="absolute" width="100%">
      <LinearProgress />
    </Box>
  ) : (
    <div />
  );
};
export default LoadingProgress;
