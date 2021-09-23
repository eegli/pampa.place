import { NextPage } from 'next';
import { useRouter } from 'next/dist/client/router';
import { useEffect } from 'react';
import Error from '../components/error';
import Play from '../components/play/play';
import RoundEnd from '../components/round/round.end';
import RoundIntermission from '../components/round/round.intermission';
import RoundResult from '../components/round/round.result';
import { STATUS } from '../redux/game';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { getRandomStreetView } from '../redux/position';
import { PageContentContainer } from '../styles';

const Game: NextPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const initialized = useAppSelector(({ game }) => game.initialized);
  const status = useAppSelector(({ game }) => game.status);
  const positionError = useAppSelector(({ position }) => position.error);

  useEffect(() => {
    if (!initialized) {
      router.push('/');
    }
  }, [initialized]);

  async function handleRetry() {
    await dispatch(getRandomStreetView({ radius: 1000 }));
  }

  function render() {
    switch (status) {
      case STATUS.INTERMISSION:
        return <RoundIntermission />;
      case STATUS.ROUND_STARTED:
        return <Play />;
      case STATUS.ROUND_ENDED:
        return <RoundEnd />;
      case STATUS.FINISHED:
        return <RoundResult />;

      default:
        return <div />;
    }
  }

  // If there is a header included, the page content container should
  // take the remaining height. The header is 48p by default
  /* 
   <GameHeader />
      <PageContentContainer height="calc(100% - 48px)">
        {render()}
      </PageContentContainer>
    </>
  
  */
  return (
    <>
      <PageContentContainer height="100%">
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
      </PageContentContainer>
    </>
  );
};

export default Game;
