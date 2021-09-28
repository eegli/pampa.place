import { Typography } from '@mui/material';
import Form from '../components/form/form';
import { PageContentContainer } from '../styles/';

const HomePage = () => {
  return (
    <PageContentContainer height="auto" disableGutters>
      <Typography variant="h3" my={6} mx={4} alignSelf="center">
        GEO GUESSERIC
      </Typography>
      <Form />
    </PageContentContainer>
  );
};

export default HomePage;
