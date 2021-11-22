import {Status, Wrapper} from '@googlemaps/react-wrapper';
import {ReactNode} from 'react';
import Spinner from '../../components/feedback/feedback.spinner';
import Login from '../../components/login/login';
import {useAppSelector} from '../../redux/redux.hooks';
import {PageContentWrapper} from '../../styles/containers';

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

  return <Wrapper apiKey={apiKey} render={render} />;
};
