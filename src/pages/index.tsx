import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import Form from '../components/form/form';
import { PageContentContainer } from '../styles/';

const HomePage = () => {
  return (
    <PageContentContainer height="auto" disableGutters>
      <Box mx={2} display="flex" flexDirection="column">
        <Typography variant="h3" my={6} alignSelf="center">
          GeoGuessEric
        </Typography>
        <Form />
      </Box>
    </PageContentContainer>
  );
};

export default HomePage;
