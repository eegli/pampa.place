import {useAppSelector} from '@/redux/redux.hooks';
import {Box, LinearProgress} from '@mui/material';

const LoadingProgress = () => {
  const isLoadingStreetView = useAppSelector(s => s.position.loading);

  return isLoadingStreetView ? (
    <Box width="100%" position="absolute">
      <LinearProgress color="secondary" />
    </Box>
  ) : (
    <></>
  );
};
export default LoadingProgress;