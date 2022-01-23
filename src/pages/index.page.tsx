import {FormMapSelect} from '@/components/form/select-map';
import {FormRoundSelect} from '@/components/form/select-round';
import {FormTimeLimitSelect} from '@/components/form/select-time';
import {FormPlayers} from '@/components/form/set-players';
import {Header} from '@/components/header/header';
import {FancyRetroTitle} from '@/components/typography/headings/retro-title';
import {initGame, reset} from '@/redux/game';
import {useAppDispatch} from '@/redux/hooks';
import {Box, Button} from '@mui/material';
import {NextPage} from 'next';
import {useRouter} from 'next/router';
import {PageContent} from '../styles/containers';

export const HomePage: NextPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  async function handleStartGame() {
    dispatch(initGame());
    await router.push('/game');
  }

  function handleReset() {
    dispatch(reset());
  }

  return (
    <>
      <Header />
      <PageContent headerGutter id="index-page">
        <FancyRetroTitle primary="PAMPA" secondary="PLACE" />
        <Box
          component="form"
          noValidate
          autoComplete="off"
          display="flex"
          flexDirection="column"
          sx={{
            '&>*': {
              mb: 4,
            },
            '&:last-child': {
              mb: 3,
            },
          }}
        >
          <FormPlayers />
          <FormRoundSelect />
          <FormTimeLimitSelect />
          <FormMapSelect />
          <Button variant="contained" color="primary" onClick={handleStartGame}>
            Start
          </Button>
          {/* Debug */}

          <Button sx={{alignSelf: 'end', mt: 2}} onClick={handleReset}>
            Reset
          </Button>
        </Box>
      </PageContent>
    </>
  );
};

export default HomePage;
