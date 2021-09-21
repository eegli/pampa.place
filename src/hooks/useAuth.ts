import { useCallback, useState } from 'react';
import { AuthReq, AuthRes } from '../pages/api/auth';

export const useAuth = () => {
  console.count('render auth hook');

  const [error, setError] = useState<boolean>(false);

  const authCallback = useCallback(async (authParams: AuthReq) => {
    // First, check if we have a local maps key
    if (process.env.MAPS_LOCAL_API_KEY) {
      return process.env.MAPS_LOCAL_API_KEY;
    }
    try {
      const res: AuthRes = await fetch(
        'api/auth?' + new URLSearchParams(authParams)
      ).then(res => res.json());
      setError(false);
      return res.key;
    } catch (e) {
      setError(true);
    }
  }, []);

  return [authCallback, error] as const;
};
