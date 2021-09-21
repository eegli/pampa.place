import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { PageContentContainer } from '../styles/';
import { Typography } from '@mui/material';
import Form from '../components/form/form';
const Home: NextPage = () => {
  return (
    <>
      <PageContentContainer height='auto'>
        <Typography variant='h3' my={8}>
          GEO GUESSERIC
        </Typography>
        <Form />
      </PageContentContainer>
    </>
  );
};

export default Home;
