import {STATUS} from '@/redux/game';
import {getRandomStreetView} from '@/redux/position/thunks';
import {NextPage} from 'next';
import {Error} from '../components/feedback/error';
import {SpeedDialNav} from '../components/nav/speed-dial/speed-dial';
import {Play} from '../components/play/play';
import {GameOverSummary} from '../components/round/game-over';
import {RoundIntermission} from '../components/round/intermission';
import {RoundOverSummary} from '../components/round/round-over';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {PageContentWrapper} from '../styles/containers';

const GamePage: NextPage = () => {
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
