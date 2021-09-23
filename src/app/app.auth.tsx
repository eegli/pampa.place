import { Status, Wrapper } from '@googlemaps/react-wrapper';
import { NextPage } from 'next';
import React from 'react';
import { getApiKey, setApiKey } from 'src/redux/app';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { PageContentContainer } from 'src/styles';
import Spinner from '../components/spinner';
import AuthInput from './app.auth-input';

export type SubmitProps = {
  secret: string;
  type: 'password' | 'key';
};

const Auth: NextPage = ({ children }) => {
  const dispatch = useAppDispatch();
  const apiKey = useAppSelector(getApiKey);

  const render = (status: Status) => {
    if (status === Status.LOADING)
      return (
        <PageContentContainer height="100%">
          <Spinner />
        </PageContentContainer>
      );
    // Failures are not captured as of now
    else if (status === Status.FAILURE)
      return (
        <PageContentContainer height="100%">
          <div>fail</div>
        </PageContentContainer>
      );
    return <></>;
  };

  // Speed up things in development
  /*   useEffect(() => {
    if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_KEY) {
      dispatch(setApiKey(process.env.NEXT_PUBLIC_KEY));
    }
  }, [dispatch]); */

  function callback(key: string) {
    dispatch(setApiKey(key));
  }

  if (!apiKey) {
    return (
      <PageContentContainer height="100%">
        <AuthInput callback={callback} />
      </PageContentContainer>
    );
  }

  return (
    <Wrapper
      apiKey={apiKey}
      render={render}
      libraries={['drawing', 'geometry', 'places', 'visualization']}
    >
      {children}
    </Wrapper>
  );
};

export default Auth;
