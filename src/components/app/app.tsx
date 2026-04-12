import { Route, Routes } from 'react-router-dom';
import { APP_ROUTE, AuthorizationStatus } from '../../const';
import MainPage from '../../pages/main-page/main-page';
import LoginPage from '../../pages/login-page/login-page';
import FavoritesPage from '../../pages/favorites-page/favorites-page';
import OfferPage from '../../pages/offer-page/offer-page';
import NotFoundPage from '../../pages/not-found-page/not-found-page';
import PrivateRoute from '../private-route/private-route';
import { HelmetProvider } from 'react-helmet-async';
import { store, useAppSelector } from '../../store';
import { getAuthorizationStatus } from '../../store/selectors';
import { checkAuthAction, fetchFavoriteOffersAction } from '../../store/api-actions';
import { useEffect } from 'react';


function App(): JSX.Element {
  const authorizationStatus = useAppSelector(getAuthorizationStatus);
  useEffect(() => {
    store.dispatch(checkAuthAction());
  }, []);

  useEffect(() => {
    if (authorizationStatus === AuthorizationStatus.Auth) {
      store.dispatch(fetchFavoriteOffersAction());
    }
  }, [authorizationStatus]);
  return (
    <HelmetProvider>
      <Routes>
        <Route
          index
          path={APP_ROUTE.Root}
          element={<MainPage />}
        />
        <Route
          path={APP_ROUTE.Login}
          element={<LoginPage />}
        />
        <Route
          path={APP_ROUTE.Favorites}
          element={
            <PrivateRoute
              autorizationStatus={authorizationStatus}
            >
              <FavoritesPage />
            </PrivateRoute>
          }
        />
        <Route
          path={APP_ROUTE.Offer}
          element={<OfferPage />}
        />
        <Route
          path={APP_ROUTE.NotFound}
          element={<NotFoundPage />}
        />
      </Routes>
    </HelmetProvider>
  );
}

export default App;
