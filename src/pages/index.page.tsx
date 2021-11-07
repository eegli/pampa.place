import { Box } from '@mui/system';
import Form from '../components/form/form';
import Header from '../components/header';
import { PageContentContainer, RetroTitle } from '../styles';

const HomePage = () => {
  return (
    <PageContentContainer height="auto" disableGutters>
      <Header />
      <Box mx={2} display="flex" flexDirection="column">
        <RetroTitle>
          <span>GeoGuessEric</span>
          <span>GeoGuessEric</span>
        </RetroTitle>
        <Form />
      </Box>
    </PageContentContainer>
  );
};

export default HomePage;
