import {LoadingProgress} from '@/components/feedback/progress';
import {startOrResumeRound} from '@/redux/game';
import {useAppDispatch, useAppSelector} from '@/redux/hooks';
import {updateSelectedPosition} from '@/redux/position';
import {getRandomStreetView} from '@/redux/position/thunks';
import {SlimContainer} from '@/styles/containers';
import {Button, Divider, Stack, Typography} from '@mui/material';
import {useEffect} from 'react';

export const RoundIntermission = () => {
  const dispatch = useAppDispatch();

  const isLoadingStreetView = useAppSelector(({position}) => position.loading);
  const currentPlayer = useAppSelector(({game}) => game.players[0]);
  const currentRound = useAppSelector(({game}) => game.rounds.current);
  const totalRounds = useAppSelector(({game}) => game.rounds.total);
  const shouldGetNewSV = useAppSelector(({game}) => game.rounds.progress === 0);

  useEffect(() => {
    if (shouldGetNewSV) {
      dispatch(getRandomStreetView());
    }
  }, [dispatch, shouldGetNewSV]);

  function handleClick() {
    dispatch(updateSelectedPosition(null));
    dispatch(startOrResumeRound());
  }

  return (
    <>
      <LoadingProgress isLoading={isLoadingStreetView} />
      <SlimContainer height="100%">
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
    </>
  );
};
