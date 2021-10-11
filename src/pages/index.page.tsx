import { Box, styled } from '@mui/system';
import Form from '../components/form/form';
import Header from '../components/header';
import { PageContentContainer } from '../styles';

const StyleHeader = styled('h3')`
  transform: skew(-15deg);
  letter-spacing: 0.03em;
  font-size: 8vw;
  position: 'relative';
  font-size: 3rem;
  &::after {
    content: '';
    position: absolute;
    top: -0.1em;
    right: 0.05em;
    width: 0.4em;
    height: 0.4em;
    background: radial-gradient(
        white 3%,
        rgba(white, 0.3) 15%,
        rgba(white, 0.05) 60%,
        transparent 80%
      ),
      radial-gradient(rgba(white, 0.2) 50%, transparent 60%) 50% 50% / 5% 100%,
      radial-gradient(rgba(white, 0.2) 50%, transparent 60%) 50% 50% / 70% 5%;
    background-repeat: no-repeat;
  }

  & > span:first-of-type {
    display: block;
    text-shadow: 0 0 0.1em #8ba2d0, 0 0 0.2em black, 0 0 0.5em #165ff3;
    -webkit-text-stroke: 0.06em rgba(black, 0.5);
  }

  & > span:last-of-type {
    position: absolute;
    left: 0;
    top: 0;
    background-image: linear-gradient(
      #032d50 25%,
      #00a1ef 35%,
      white 50%,
      #20125f 50%,
      #8313e7 55%,
      #ff61af 75%
    );
    -webkit-text-stroke: 0.01em #94a0b9;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const HomePage = () => {
  return (
    <PageContentContainer height="auto" disableGutters>
      <Header />
      <Box mx={2} display="flex" flexDirection="column">
        <StyleHeader>
          <span>GeoGuessEric</span>
          <span>GeoGuessEric</span>
        </StyleHeader>

        <Form />
      </Box>
    </PageContentContainer>
  );
};

export default HomePage;
