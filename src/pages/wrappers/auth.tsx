import {Spinner} from '@/components/feedback/spinner';
import {Login} from '@/components/login/login';
import {Constants} from '@/config/constants';
import {setApiKey} from '@/redux/app';
import {useAppDispatch, useAppSelector} from '@/redux/hooks';
import {PageContent} from '@/styles/containers';
import {Status, Wrapper} from '@googlemaps/react-wrapper';
import {ReactNode, useEffect} from 'react';
import {CustomHead} from '../../components/head/custom-head';

declare global {
  interface Window {
    gm_authFailure: () => void;
  }
}

export const AuthWrapper = ({children}: {children?: ReactNode}) => {
  const apiKey = useAppSelector(s => s.app.apiKey);
  const dispatch = useAppDispatch();

  // Check if an api key is already present in local storage
  useEffect(() => {
    const apiKey = window.sessionStorage.getItem(Constants.SESSION_API_KEY);
    if (typeof apiKey === 'string') {
      dispatch(setApiKey(apiKey));
    }
  }, [dispatch]);

  // https://developers.google.com/maps/documentation/javascript/events
  useEffect(() => {
    window.gm_authFailure = () => {
      console.error('Invalid Google Maps API key: ' + apiKey);
    };
  }, [apiKey]);

  // An empty string as api key is allowed for development mode
  if (typeof apiKey !== 'string')
    return (
      <>
        <CustomHead title="login" />
        <Login />
      </>
    );

  return (
    <Wrapper
      apiKey={apiKey}
      version="3.47.2"
      render={status => {
        switch (status) {
          case Status.LOADING:
            return (
              <PageContent id="spinner">
                <Spinner />
              </PageContent>
            );
          default:
            return (
              <PageContent id="spinner">
                <div>mega fail</div>
              </PageContent>
            );
        }
      }}
    >
      {children}
    </Wrapper>
  );
};
