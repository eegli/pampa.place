import { STATUS } from '@/redux/slices/game';
import { getRandomStreetView } from '@/redux/slices/position';
import Error from '../components/error';
import Play from '../components/play/play';
import RoundEnd from '../components/round/round.end';
import RoundIntermission from '../components/round/round.intermission';
import RoundResult from '../components/round/round.result';
import BasicSpeedDial from '../components/speed-dial';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { PageContentContainer } from '../styles';

const GamePage = () => {
  const dispatch = useAppDispatch();

  const status = useAppSelector(({ game }) => game.status);
  const positionError = useAppSelector(({ position }) => position.error);

  async function handleRetry() {
    await dispatch(getRandomStreetView());
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
      <PageContentContainer height="100%" disableGutters>
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
        )}{' '}
        <BasicSpeedDial />
      </PageContentContainer>{' '}
    </>
  );
};

export default GamePage;
