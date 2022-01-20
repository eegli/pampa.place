import {Error} from '@/components/feedback/error';
import {Play} from '@/components/game/game';
import {GameOverSummary} from '@/components/game/intermissions/game-over';
import {RoundIntermission} from '@/components/game/intermissions/round-intermission';
import {RoundOverSummary} from '@/components/game/intermissions/round-over';
import {SpeedDialNav} from '@/components/nav/speed-dial/speed-dial';
import {STATUS} from '@/redux/game';
import {useAppDispatch, useAppSelector} from '@/redux/hooks';
import {resetError} from '@/redux/position';
import {getRandomStreetView} from '@/redux/position/thunks';
import {PageContent} from '@/styles/containers';
import {NextPage} from 'next';
import {useEffect} from 'react';

// An approach to shallow rendering. Utils can easily be mocked in
// tests.
export const utils = {
  render: (status: STATUS) => {
    switch (status) {
      case STATUS.PENDING_PLAYER:
        return <RoundIntermission />;
      case STATUS.ROUND_ONGOING:
        return <Play />;
      case STATUS.ROUND_ENDED:
        return <RoundOverSummary />;
      case STATUS.FINISHED:
        return <GameOverSummary />;
      default:
        return null;
    }
  },
};

export const GamePage: NextPage = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(({game}) => game.status);
  const positionError = useAppSelector(({position}) => position.error);

  function handleRetry() {
    dispatch(resetError());
    dispatch(getRandomStreetView());
  }

  useEffect(() => {
    if (positionError) {
      return () => {
        dispatch(resetError());
      };
    }
  }, [dispatch, positionError]);

  return (
    <PageContent id="game-page">
      {positionError ? (
        <Error
          primaryAction={handleRetry}
          primaryActionText="Search again"
          secondaryActionText="Choose different map"
          title="Error getting Street View data"
          info={`This is likely because the map you chose is a little
                too small or has little Street View coverage`}
          error={positionError.message}
        />
      ) : (
        utils.render(status)
      )}
      <SpeedDialNav />
    </PageContent>
  );
};

export default GamePage;
