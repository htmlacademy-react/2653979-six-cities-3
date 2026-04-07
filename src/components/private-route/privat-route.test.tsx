import { APP_ROUTE, AuthorizationStatus } from '../../const';
import { withHistory } from '../../utils/mock-component';
import { Route, Routes } from 'react-router-dom';
import PrivateRoute from './private-route';
import { render, screen } from '@testing-library/react';

describe('Privat route component', () => {
  it('should render component for public rout, whrn user not autorized', () => {
    const expectedText = 'publick route';
    const notExpectedText = 'privat route';

    const preparedComponent = withHistory(
      <Routes>
        <Route path={APP_ROUTE.Login} element={<span>{expectedText}</span>}></Route>
        <Route path={APP_ROUTE.Favorites} element={
          <PrivateRoute autorizationStatus={AuthorizationStatus.NoAuth}>
            <span>{notExpectedText}</span>
          </PrivateRoute>
        }
        >
        </Route>
      </Routes>,
      [APP_ROUTE.Favorites]
    );

    render(preparedComponent);
    expect(screen.getByText(expectedText)).toBeInTheDocument();
    expect(screen.queryByText(notExpectedText)).not.toBeInTheDocument();
  });

  it('should render component for public rout, whrn user autorized', () => {
    const expectedText = 'privat route';
    const notExpectedText = 'publick route';

    const preparedComponent = withHistory(
      <Routes>
        <Route path={APP_ROUTE.Login} element={<span>{expectedText}</span>}></Route>
        <Route path={APP_ROUTE.Favorites} element={
          <PrivateRoute autorizationStatus={AuthorizationStatus.Auth}>
            <span>{expectedText}</span>
          </PrivateRoute>
        }
        >
        </Route>
      </Routes>,
      [APP_ROUTE.Favorites]
    );

    render(preparedComponent);
    expect(screen.getByText(expectedText)).toBeInTheDocument();
    expect(screen.queryByText(notExpectedText)).not.toBeInTheDocument();
  });
});
