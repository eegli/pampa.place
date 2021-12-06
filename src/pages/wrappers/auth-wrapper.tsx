import {Status, Wrapper} from '@googlemaps/react-wrapper';
import {ReactNode} from 'react';
import {Spinner} from '../../components/feedback/spinner';
import {useAppSelector} from '../../redux/hooks';
import {PageContentWrapper} from '../../styles/containers';
import {Login} from './login';

export const AuthWrapper = ({children}: {children?: ReactNode}) => {
  const apiKey = useAppSelector(s => s.app.apiKey);

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

  return <Wrapper apiKey={apiKey} render={render} version="3.47.2" />;
};
