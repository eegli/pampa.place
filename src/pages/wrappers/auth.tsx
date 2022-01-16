import {Spinner} from '@/components/feedback/spinner';
import {Status, Wrapper} from '@googlemaps/react-wrapper';
import {ReactNode, useEffect} from 'react';
import {useAppSelector} from '../../redux/hooks';
import {PageContentWrapper} from '../../styles/containers';
import {Login} from './login';

declare global {
  interface Window {
    gm_authFailure: () => void;
  }
}

export const AuthWrapper = ({children}: {children?: ReactNode}) => {
  const apiKey = useAppSelector(s => s.app.apiKey);

  // https://developers.google.com/maps/documentation/javascript/events
  useEffect(() => {
    window.gm_authFailure = () => {
      console.error('Invalid Google Maps API key: ' + apiKey);
    };
  }, [apiKey]);

  // An empty string as api key is allowed for development mode
  if (typeof apiKey !== 'string') return <Login />;

  function render(status: Status) {
    switch (status) {
      case Status.SUCCESS:
        return <>{children}</>;
      case Status.LOADING:
        return (
          <PageContentWrapper id="spinner">
            <Spinner />
          </PageContentWrapper>
        );
      default:
        return (
          <PageContentWrapper id="spinner">
            <div>mega fail</div>
          </PageContentWrapper>
        );
    }
  }

  return <Wrapper apiKey={apiKey} version="3.47.2" render={render} />;
};
