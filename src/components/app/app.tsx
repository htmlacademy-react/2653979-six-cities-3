import { Route, BrowserRouter, Routes } from 'react-router-dom';
import { APP_ROUTE } from '../../const';
import MainPage from '../../pages/main-page/main-page';
import LoginPage from '../../pages/login-page/login-page';
import FavoritesPage from '../../pages/favorites-page/favorites-page';
import OfferPage from '../../pages/offer-page/offer-page';
import NotFoundPage from '../../pages/not-found-page/not-found-page';
import PrivateRoute from '../private-route/private-route';
import { HelmetProvider } from 'react-helmet-async';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchOfferAction } from '../../store/api-actions';
import { useEffect } from 'react';
import { getAuthorizationStatus } from '../../store/selectors';

function App(): JSX.Element {

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchOfferAction());
  }, [dispatch]);

  const authorizationStatus = useAppSelector(getAuthorizationStatus);
  return (
    <HelmetProvider>
      <BrowserRouter>
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
            path='*'
            element={<NotFoundPage />}
          />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
