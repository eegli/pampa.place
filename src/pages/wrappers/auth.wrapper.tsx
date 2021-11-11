import {Status, Wrapper} from '@googlemaps/react-wrapper';
import {ReactNode} from 'react';
import Login from '../../components/login';
import Spinner from '../../components/spinner';
import {useAppSelector} from '../../redux/redux.hooks';
import {PageContentContainer} from '../../styles/containers';

export const AuthWrapper = ({children}: {children: ReactNode}) => {
  const apiKey = useAppSelector(s => s.app.apiKey);

  // An empty string as api key is allowed for development mode
  if (apiKey === undefined) return <Login />;

  function render(status: Status) {
    switch (status) {
      case Status.SUCCESS:
        return <>{children}</>;
      case Status.LOADING:
        return (
          <PageContentContainer
            id="spinner"
            sx={{
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Spinner />
          </PageContentContainer>
        );

      default:
        return (
          <PageContentContainer height="100%">
            <div>fail</div>
          </PageContentContainer>
        );
    }
  }

  return <Wrapper apiKey={apiKey} render={render} />;
};
