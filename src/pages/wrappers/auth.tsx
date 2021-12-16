import {Status, Wrapper} from '@googlemaps/react-wrapper';
import {ReactNode, useEffect} from 'react';
import {Spinner} from '../../components/feedback/spinner';
import {useAppSelector} from '../../redux/hooks';
import {PageContentWrapper} from '../../styles/containers';
import {Login} from './login';

export const AuthWrapper = ({children}: {children?: ReactNode}) => {
  const apiKey = useAppSelector(s => s.app.apiKey);

  // https://developers.google.com/maps/documentation/javascript/events
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).gm_authFailure = () => {
      // Maybe a TODO
    };
  });

  // An empty string as api key is allowed for development mode
  if (typeof apiKey !== 'string') return <Login />;

  return (
    <Wrapper
      apiKey={apiKey}
      version="3.47.2"
      render={status => {
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
      }}
    />
  );
};
