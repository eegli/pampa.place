import {Form} from '../components/form/form';
import {Header} from '../components/header/header';
import {FancyRetroTitle} from '../components/typography/retro-title';
import {PageContentWrapper} from '../styles/containers';

const HomePage = () => {
  return (
    <>
      <Header />
      <PageContentWrapper headerGutter id="index-page" width="25rem">
        <FancyRetroTitle primary="PAMPA" secondary="PLACE" />
        <Form />
      </PageContentWrapper>
    </>
  );
};

export default HomePage;
