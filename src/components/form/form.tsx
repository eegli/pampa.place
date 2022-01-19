import {initGame, reset} from '@/redux/game';
import {useAppDispatch} from '@/redux/hooks';
import {Box, Button} from '@mui/material';
import {useRouter} from 'next/router';
import {FormMapSelect} from './fields/select-map';
import {FormRoundSelect} from './fields/select-round';
import {FormTimeLimitSelect} from './fields/select-time';
import {FormPlayers} from './fields/set-players';

export const Form = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  async function handleSubmit() {
    dispatch(initGame());
    await router.push('/game');
  }

  function handleReset() {
    dispatch(reset());
  }

  return (
    <>
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
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Start
        </Button>
        {/* Debug */}

        <Button sx={{alignSelf: 'end', mt: 2}} onClick={handleReset}>
          Reset
        </Button>
      </Box>
    </>
  );
};
