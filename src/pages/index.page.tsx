import {Form} from '../components/form/form';
import {Header} from '../components/header/header';
import {FancyRetroTitle} from '../components/typography/retro-title';
import {PageContentWrapper} from '../styles/containers';

const HomePage = () => {
  return (
    <PageContentWrapper id="index-page" headerGutter width="25rem">
      <Header />
      <FancyRetroTitle primary="PAMPA" secondary="PLACE" />
      <Form />
    </PageContentWrapper>
  );
};

export default HomePage;
