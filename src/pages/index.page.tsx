import {NextPage} from 'next';
import {Form} from '../components/form/form';
import {Header} from '../components/nav/header/header';
import {FancyRetroTitle} from '../components/typography/retro-title';
import {PageContentWrapper} from '../styles/containers';

const HomePage: NextPage = () => {
  return (
    <>
      <Header />
      <PageContentWrapper headerGutter id="index-page">
        <FancyRetroTitle primary="PAMPA" secondary="PLACE" />
        <Form />
      </PageContentWrapper>
    </>
  );
};

export default HomePage;
