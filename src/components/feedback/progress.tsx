import {Box, LinearProgress} from '@mui/material';

export const LoadingProgress = ({isLoading}: {isLoading: boolean}) => {
  return isLoading ? (
    <Box width="100%" position="absolute">
      <LinearProgress color="secondary" />
    </Box>
  ) : null;
};
