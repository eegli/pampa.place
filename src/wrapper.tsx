import { Status, Wrapper } from '@googlemaps/react-wrapper';
import { NextPage } from 'next';
import React from 'react';
import { useAuth } from 'src/hooks/useAuth';
import { PageContentContainer } from 'src/styles';
import Spinner from './components/spinner';
import GoogleWrapperInput from './wrapper-input';

const GoogleWrapper: NextPage = ({ children }) => {
  const [key, authorize, error] = useAuth();

  const render = (status: Status) => {
    if (status === Status.LOADING) return <Spinner />;
    if (status === Status.FAILURE) return <div>Error</div>;
    return <div />;
  };

  function handleSubmit(pw: string) {
    authorize({ pw });
  }

  if (!key) {
    return (
      <PageContentContainer height='100%'>
        <GoogleWrapperInput callback={handleSubmit} />
        {error && <div>an error occured</div>}
      </PageContentContainer>
    );
  }
  return (
    <Wrapper
      apiKey={key}
      render={render}
      libraries={['drawing', 'geometry', 'places', 'visualization']}>
      {children}
    </Wrapper>
  );
};

export default GoogleWrapper;
