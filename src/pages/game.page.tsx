import {STATUS} from '@/redux/game';
import {getRandomStreetView} from '@/redux/position/thunks';
import {Error} from '../components/feedback/error';
import {SpeedDialNav} from '../components/nav/speed-dial';
import {Play} from '../components/play/play';
import {GameOverSummary} from '../components/round/states/game-over';
import {RoundIntermission} from '../components/round/states/round-intermission';
import {RoundOverSummary} from '../components/round/states/round-over';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {PageContentWrapper} from '../styles/containers';

const GamePage = () => {
  const dispatch = useAppDispatch();

  const status = useAppSelector(({game}) => game.status);
  const positionError = useAppSelector(({position}) => position.error);

  async function handleRetry() {
    dispatch(getRandomStreetView());
  }

  function render() {
    switch (status) {
      case STATUS.PENDING_PLAYER:
        return <RoundIntermission />;
      case STATUS.ROUND_STARTED:
        return <Play />;
      case STATUS.ROUND_ENDED:
        return <RoundOverSummary />;
      case STATUS.FINISHED:
        return <GameOverSummary />;

      default:
        return <div />;
    }
  }

  // If there is a header included, the page content container should
  // take the remaining height. The header is 48p by default
  /* 
   <GameHeader />
      <PageContentWrapper height="calc(100% - 48px)">
        {render()}
      </PageContentWrapper>
    </>
  
  */
  return (
    <>
      <PageContentWrapper height="100%" id="game-page">
        {positionError ? (
          <Error
            callback={handleRetry}
            title="Error getting Street View data"
            info="This is likely because the map you chose is a little
                too small or has little Street View coverage."
            reason={positionError.message}
          />
        ) : (
          render()
        )}
        <SpeedDialNav />
      </PageContentWrapper>
    </>
  );
};

export default GamePage;
