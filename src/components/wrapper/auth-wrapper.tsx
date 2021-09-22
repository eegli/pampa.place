import { Status, Wrapper } from '@googlemaps/react-wrapper';
import { NextPage } from 'next';
import React, { useEffect } from 'react';
import { getApiKey, setApiKey } from 'src/redux/app';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { PageContentContainer } from 'src/styles';
import Spinner from '../spinner';
import AuthInput from './auth-input';

export type SubmitProps = {
  secret: string;
  type: 'password' | 'key';
};

const AuthWrapper: NextPage = ({ children }) => {
  const dispatch = useAppDispatch();
  const apiKey = useAppSelector(getApiKey);

  const render = (status: Status) => {
    if (status === Status.LOADING) return <Spinner />;
    else if (status === Status.FAILURE) return <div>fail</div>;
    return <div />;
  };

  // Speed up things in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_KEY) {
      dispatch(setApiKey(process.env.NEXT_PUBLIC_KEY));
    }
  }, [dispatch]);

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

export default AuthWrapper;
