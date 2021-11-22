import {shouldRequestNewSV} from '@/redux/game/game.selectors';
import {startRound} from '@/redux/game/game.slice';
import {resetSelectedPosition} from '@/redux/position/position.slice';
import {getRandomStreetView} from '@/redux/position/position.thunks';
import {useAppDispatch, useAppSelector} from '@/redux/redux.hooks';
import {Button, Divider, Stack, Typography} from '@mui/material';
import {useLayoutEffect} from 'react';
import {SlimContainer} from '../../styles/containers';

const RoundIntermission = () => {
  const dispatch = useAppDispatch();

  const isLoadingStreetView = useAppSelector(({position}) => position.loading);
  const currentPlayer = useAppSelector(({game}) => game.players[0]);
  const currentRound = useAppSelector(({game}) => game.rounds.current);
  const totalRounds = useAppSelector(({game}) => game.rounds.total);
  const shouldGetNewSV = useAppSelector(shouldRequestNewSV);

  useLayoutEffect(() => {
    if (shouldGetNewSV) {
      dispatch(getRandomStreetView());
    }
  }, [dispatch, shouldGetNewSV]);

  function handleClick() {
    dispatch(resetSelectedPosition());
    dispatch(startRound());
  }

  return (
    <SlimContainer height="100%" id="c-round-intermission">
      <Stack direction="column" alignItems="center" spacing={3} margin="auto">
        <Typography variant="h4" align="center">
          {currentPlayer}, it&apos;s your turn!
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

        <Button
          onClick={handleClick}
          variant="contained"
          color="primary"
          disabled={isLoadingStreetView}
        >
          {isLoadingStreetView
            ? 'Getting a random Street View...'
            : 'Start Round'}
        </Button>
      </Stack>
    </SlimContainer>
  );
};
export default RoundIntermission;
