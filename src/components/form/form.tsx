import { config } from '@/config/game';
import { CUSTOM_MAP_IDS, DEFAULT_MAP_IDS } from '@/config/maps';
import { useAppDispatch } from '@/redux/hooks';
import { initGame, reset } from '@/redux/slices/game';
import { Box, Button } from '@mui/material';
import { useRouter } from 'next/router';
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
        <FormRoundSelect rounds={config.rounds} />
        <FormTimeLimitSelect timeLimits={config.timeLimits} />
        <FormMapSelect
          customMapIds={CUSTOM_MAP_IDS}
          defaultMapIds={DEFAULT_MAP_IDS}
        />
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
};

export default Form;
