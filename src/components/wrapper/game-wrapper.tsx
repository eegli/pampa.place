import { NextPage } from 'next';
import { useRouter } from 'next/dist/client/router';
import { isInitialized } from '../../redux/game/game.selectors';
import { useAppSelector } from '../../redux/hooks';

const GameWrapper: NextPage = ({ children }) => {
  const router = useRouter();
  const gameInitialized = useAppSelector(isInitialized);

  if (!gameInitialized) {
    router.push('/');
    return <div />;
  }
  return <>{children}</>;
};

export default GameWrapper;
