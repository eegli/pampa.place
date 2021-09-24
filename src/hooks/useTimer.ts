import defaults from '@config/defaults';
import { useEffect, useState } from 'react';

export const useTimer = () => {
  const [active, setActive] = useState<boolean>(false);
  const [seconds, setSeconds] = useState<number>(defaults.game.timeLimit);

  useEffect(() => {
    if (active) {
      const timer = setTimeout(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else {
          setActive(false);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [active, seconds]);

  return [seconds, () => setActive(true)] as const;
};
