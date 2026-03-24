import { Navigate } from 'react-router-dom';
import { APP_ROUTE, AuthorizationStatus } from '../../const';
import Spinner from '../spinner/spinner';

type PrivateRouteProps = {
  autorizationStatus: AuthorizationStatus;
  children: JSX.Element;
}

function PrivateRoute({ autorizationStatus, children }: PrivateRouteProps): JSX.Element {
  if (autorizationStatus === AuthorizationStatus.Unknown) {
    return <Spinner />;
  }
  if (autorizationStatus !== AuthorizationStatus.Auth) {
    return <Navigate to={APP_ROUTE.Login} replace />;
  }
  return children;
}

export default PrivateRoute;
