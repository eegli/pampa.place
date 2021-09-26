import { Typography } from '@mui/material';
import type { NextPage } from 'next';
import Form from '../components/form/form';
import { PageContentContainer } from '../styles/';

const Home: NextPage = () => {
  return (
    <PageContentContainer height="auto">
      <Typography variant="h3" my={8}>
        GEO GUESSERIC
      </Typography>
      <Form />
    </PageContentContainer>
  );
};

export default Home;
