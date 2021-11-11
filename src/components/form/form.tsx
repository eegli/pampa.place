import {initGame, reset} from '@/redux/game/game.slice';
import {useAppDispatch} from '@/redux/redux.hooks';
import {Box, Button} from '@mui/material';
import {useRouter} from 'next/router';
import React from 'react';
import FormMapSelect from './form.map-select';
import FormPlayers from './form.players';
import FormRoundSelect from './form.round-select';
import FormTimeLimitSelect from './form.time-select';

const Form = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleSubmit = () => {
    dispatch(initGame());
    router.push('/game');
  };

  // TODO reset state
  const handleReset = () => {
    dispatch(reset());
  };

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
        <Button
          sx={{
            my: 2,
            flexGrow: 0,
          }}
          variant="contained"
          color="primary"
          onClick={handleSubmit}
        >
          Start
        </Button>
        {/* Debug */}

        <Button sx={{alignSelf: 'end'}} onClick={handleReset} type="submit">
          Reset
        </Button>
      </Box>
    </>
  );
};

export default Form;
