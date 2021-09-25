import { MapData } from '@config/maps';
import { Box, Button } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { initGame, reset } from '../../redux/game';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import FormMapSelect from './form.location-select';
import FormPlayers from './form.players';
import FormRoundSelect from './form.round-select';

export default function Form() {
  const [players, setPlayers] = useState<string[]>([]);
  const [rounds, setRounds] = useState<number>();
  const [activeMap, setMap] = useState<MapData>();
  const [timeLimit, setTimeLimit] = useState<false | number>(false);

  const [inputError, setInputError] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const existingPlayers = useAppSelector(({ game }) => game.players);
  const existingRounds = useAppSelector(({ game }) => game.rounds.total);
  const existingMap = useAppSelector(({ game }) => game.map);

  useEffect(() => {
    setPlayers(existingPlayers);
    setRounds(existingRounds);
    setMap(existingMap);
  }, [existingPlayers, existingRounds, existingMap]);

  const handleSubmit = () => {
    const validPlayers = players.filter(Boolean);

    if (!validPlayers.length) {
      setInputError(true);
    } else if (activeMap && rounds) {
      setInputError(false);
      dispatch(
        initGame({
          names: validPlayers,
          map: activeMap,
          rounds,
          timeLimit,
        })
      );
      router.push('/game');
    }
  };

  const clearInputError = () => setInputError(false);

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
        <FormPlayers
          players={players}
          setPlayers={setPlayers}
          inputError={inputError}
          clearInputError={clearInputError}
        />

        <FormRoundSelect setRounds={setRounds} rounds={rounds} />

        <FormMapSelect setMap={setMap} map={activeMap} />

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
