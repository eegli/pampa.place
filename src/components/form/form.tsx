import { MapData } from '@config';
import { Box, Button } from '@mui/material';
import { useRouter } from 'next/dist/client/router';
import { useEffect, useState } from 'react';
import {
  getActiveMap,
  getPlayerNames,
  getTotalRoundNum,
  initGame,
  reset,
} from '../../redux/game';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import FormMapSelect from './form.location-select';
import FormPlayers from './form.players';
import FormRoundSelect from './form.round-select';

export default function Form() {
  const [players, setPlayers] = useState<string[]>([]);
  const [rounds, setRounds] = useState<number>();
  const [activeMap, setActiveMap] = useState<MapData>();

  const [inputError, setInputError] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const reduxPlayers = useAppSelector(getPlayerNames);
  const reduxRounds = useAppSelector(getTotalRoundNum);
  const reduxMap = useAppSelector(getActiveMap);

  useEffect(() => {
    setPlayers(reduxPlayers);
    setRounds(reduxRounds);
    setActiveMap(reduxMap);
  }, [reduxPlayers, reduxRounds, reduxMap]);

  const handleSubmit = () => {
    const validPlayers = players.filter(Boolean);

    if (!validPlayers.length) {
      setInputError(true);
    } else if (activeMap && rounds) {
      setInputError(false);
      dispatch(
        initGame({
          names: players.filter(Boolean),
          rounds,
          map: activeMap,
        })
      );
      router.push('/game');
    }
  };

  // TODO reset state
  const handleReset = () => {
    dispatch(reset());
  };

  return (
    <>
      <Box
        component='form'
        noValidate
        autoComplete='off'
        display='flex'
        flexDirection='column'
        sx={{
          '&>*': {
            marginBottom: 3,
          },
          '&:last-child': {
            marginBottom: 3,
          },
        }}>
        <FormPlayers
          players={players}
          setPlayers={setPlayers}
          inputError={inputError}
        />

        <FormRoundSelect setRounds={setRounds} rounds={rounds} />
        {/*   <FormDurationSelect /> */}
        <FormMapSelect setMap={setActiveMap} map={activeMap} />

        <Button
          sx={{
            my: 2,
            flexGrow: 0,
          }}
          variant='contained'
          color='primary'
          onClick={handleSubmit}>
          Start
        </Button>
        {/* Debug */}

        <Button sx={{ alignSelf: 'end' }} onClick={handleReset} type='submit'>
          Reset
        </Button>
      </Box>
    </>
  );
}
