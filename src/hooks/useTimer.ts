import {useEffect, useState} from 'react';

export function useTimer(startTime: number) {
  const [seconds, setSeconds] = useState<number>(startTime);

  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => {
        setSeconds(seconds - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [seconds]);

  return [seconds] as const;
}
