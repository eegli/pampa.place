import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { shouldRequestNewSV } from '@/redux/selectors/game';
import { startRound } from '@/redux/slices/game';
import {
  getRandomStreetView,
  resetSelectedPosition,
} from '@/redux/slices/position';
import { Button, Divider, Stack, Typography } from '@mui/material';
import { useEffect } from 'react';
import { SlimContainer } from '../../styles';

const RoundIntermission = () => {
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
};
export default RoundIntermission;
