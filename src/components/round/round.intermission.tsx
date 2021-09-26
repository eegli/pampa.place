import { Button, Divider, Stack, Typography } from '@mui/material';
import { useEffect } from 'react';
import { shouldRequestNewSV, startRound } from '../../redux/game';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  getRandomStreetView,
  resetSelectedPosition,
} from '../../redux/position';
import { SlimContainer } from '../../styles';

export default function RoundIntermission() {
  const dispatch = useAppDispatch();

  const players = useAppSelector(({ game }) => game.players.names);
  const currentRound = useAppSelector(({ game }) => game.rounds.current);
  const totalRounds = useAppSelector(({ game }) => game.rounds.total);
  const shouldGetNewSV = useAppSelector(shouldRequestNewSV);

  useEffect(() => {
    if (shouldGetNewSV) {
      (async () => {
        await dispatch(getRandomStreetView());
      })();
    }
  }, [dispatch, shouldGetNewSV]);

  function handleClick() {
    dispatch(resetSelectedPosition());
    dispatch(startRound());
  }

  return (
    <SlimContainer fullHeight>
      <Stack direction="column" alignItems="center" spacing={3}>
        <Typography variant="h3" align="center">
          {players[0]}, it&apos;s your turn!
        </Typography>
        <Divider orientation="horizontal" flexItem />
        <Typography
          variant="h6"
          sx={{
            color: 'text.secondary',
          }}
        >
          Round {currentRound}/{totalRounds}
        </Typography>

        <Button onClick={handleClick} variant="contained" color="primary">
          Start
        </Button>
      </Stack>
    </SlimContainer>
  );
}
