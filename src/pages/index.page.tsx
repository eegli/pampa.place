import { Box } from '@mui/system';
import React from 'react';
import Form from '../components/form/form';
import Header from '../components/header';
import FancyRetroTitle from '../components/typography/typography';
import { PageContentContainer } from '../styles/containers';

const HomePage = () => {
  return (
    <PageContentContainer height="auto" disableGutters>
      <Header />
      <Box mx={2} display="flex" flexDirection="column">
        <FancyRetroTitle primary="PAMPA" secondary="PLACE" />
        <Form />
      </Box>
    </PageContentContainer>
  );
};

export default HomePage;
