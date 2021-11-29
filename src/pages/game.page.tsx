import {STATUS} from '@/redux/game/game.slice';
import {getRandomStreetView} from '@/redux/position/position.thunks';
import React from 'react';
import Error from '../components/feedback/feedback.error';
import SpeedDialNav from '../components/nav/nav.speed-dial';
import Play from '../components/play/play';
import RoundEnd from '../components/round/round.end';
import RoundFinalResult from '../components/round/round.final-result';
import RoundIntermission from '../components/round/round.intermission';
import {useAppDispatch, useAppSelector} from '../redux/redux.hooks';
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
        return <RoundEnd />;
      case STATUS.FINISHED:
        return <RoundFinalResult />;

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
