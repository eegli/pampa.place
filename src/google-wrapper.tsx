import { Status, Wrapper } from '@googlemaps/react-wrapper';
import { NextPage } from 'next';
import React, { useState } from 'react';
import { useAuth } from 'src/hooks/useAuth';
import { PageContentContainer } from 'src/styles';
import Spinner from './components/spinner';
import GoogleWrapperInput from './google-wrapper-input';

const GoogleWrapper: NextPage = ({ children }) => {
  const [authorize, error] = useAuth();
  const [apiKey, setApiKey] = useState<string>();

  async function handleSubmit(pw: string) {
    const key = await authorize({ pw });
    setApiKey(key);
  }

  const render = (status: Status) => {
    if (status === Status.LOADING) return <Spinner />;
    return <div />;
  };

  if (!apiKey) {
    return (
      <PageContentContainer height='100%'>
        <GoogleWrapperInput callback={handleSubmit} />
        {error && <div>an error occured</div>}
      </PageContentContainer>
    );
  }

  return (
    <Wrapper
      apiKey={apiKey}
      render={render}
      libraries={['drawing', 'geometry', 'places', 'visualization']}>
      {children}
    </Wrapper>
  );
};

export default GoogleWrapper;
