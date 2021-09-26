import { STATUS } from '@/redux/slices/game';
import { getRandomStreetView } from '@/redux/slices/position';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Error from '../components/error';
import Play from '../components/play/play';
import RoundEnd from '../components/round/round.end';
import RoundIntermission from '../components/round/round.intermission';
import RoundResult from '../components/round/round.result';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { PageContentContainer } from '../styles';

const Game: NextPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const status = useAppSelector(({ game }) => game.status);
  const positionError = useAppSelector(({ position }) => position.error);

  // Redirect to home if game has not bee initialized properly
  useEffect(() => {
    if (status === STATUS.PENDING_START) {
      router.push('/');
    }
  }, [router, status]);

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
