import { Navigate } from 'react-router-dom';
import { APP_ROUTE, AuthorizationStatus } from '../../const';

type privateRouteProps = {
  autorizationStatus: AuthorizationStatus;
  children: JSX.Element;
}

function PrivateRoute({ autorizationStatus, children }: privateRouteProps): JSX.Element {
  return (
    autorizationStatus === AuthorizationStatus.Auth ? children : <Navigate to={APP_ROUTE.Login}/>
  );
}

export default PrivateRoute;
