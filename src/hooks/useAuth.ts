import { useCallback, useState } from 'react';
import { AuthReq, AuthRes } from '../pages/api/auth';

export const useAuth = () => {
  console.count('render auth hook');
  const [key, setKey] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  const authCallback = useCallback(async (authParams: AuthReq) => {
    try {
      const res: AuthRes = await fetch(
        'api/auth?' + new URLSearchParams(authParams)
      ).then(res => res.json());

      setKey(res.key);
      setError(false);
    } catch (e) {
      setError(true);
    }
  }, []);

  return [key, authCallback, error] as const;
};
