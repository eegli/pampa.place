import {Error} from '@/components/feedback/error';
import {GameOverSummary} from '@/components/intermissions/game-over';
import {RoundIntermission} from '@/components/intermissions/round-intermission';
import {RoundOverSummary} from '@/components/intermissions/round-over';
import {Play} from '@/components/play/play';
import {SpeedDialNav} from '@/components/speed-dial/speed-dial';
import {STATUS} from '@/redux/game';
import {useAppDispatch, useAppSelector} from '@/redux/hooks';
import {resetError} from '@/redux/position';
import {PageContent} from '@/styles/containers';
import {NextPage} from 'next';
import {useRouter} from 'next/router';

function renderStatus(status: STATUS) {
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
}

export const GamePage: NextPage = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(({game}) => game.status);
  const positionError = useAppSelector(({position}) => position.error);
  const router = useRouter();

  function handleRetry() {
    dispatch(resetError());
  }

  function handleGoHome() {
    router.push('/').then(() => {
      dispatch(resetError());
    });
  }

  return (
    <PageContent id="game-page">
      {positionError ? (
        <Error
          primaryAction={handleRetry}
          primaryActionText="Search again"
          secondaryAction={handleGoHome}
          secondaryActionText="Choose different map"
          title="Error getting Street View data"
          info={`This is likely because the map you chose is a little
                too small or has little Street View coverage`}
          error={positionError.message}
        />
      ) : (
        renderStatus(status)
      )}
      <SpeedDialNav />
    </PageContent>
  );
};

export default GamePage;
