import {Form} from '@/components/form/form';
import {Header} from '@/components/nav/header/header';
import {FancyRetroTitle} from '@/components/typography/headings/retro-title';
import {NextPage} from 'next';
import {PageContent} from '../styles/containers';

const HomePage: NextPage = () => {
  return (
    <>
      <Header />
      <PageContent headerGutter id="index-page">
        <FancyRetroTitle primary="PAMPA" secondary="PLACE" />
        <Form />
      </PageContent>
    </>
  );
};

export default HomePage;
