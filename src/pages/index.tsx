import { Typography } from '@mui/material';
import type { NextPage } from 'next';
import Form from '../components/form/form';
import { PageContentContainer } from '../styles/';

const Home: NextPage = () => {
  return (
    <PageContentContainer height="auto" disableGutters>
      <Typography variant="h3" my={6} mx={4} alignSelf="center">
        GEO GUESSERIC
      </Typography>
      <Form />
    </PageContentContainer>
  );
};

export default Home;
