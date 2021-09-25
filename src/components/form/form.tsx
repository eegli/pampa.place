import { Box, Button } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import { initGame, reset } from '../../redux/game';
import { useAppDispatch } from '../../redux/hooks';
import FormMapSelect from './form.location-select';
import FormPlayers from './form.players';
import FormRoundSelect from './form.round-select';

export default function Form() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleSubmit = () => {
    dispatch(
      initGame({
        timeLimit: 99,
      })
    );
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
            marginBottom: 3,
          },
          '&:last-child': {
            marginBottom: 3,
          },
        }}
      >
        <FormPlayers />

        <FormRoundSelect />

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

        <Button sx={{ alignSelf: 'end' }} onClick={handleReset} type="submit">
          Reset
        </Button>
      </Box>
    </>
  );
}
