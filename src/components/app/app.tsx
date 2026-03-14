import { Route, BrowserRouter, Routes } from 'react-router-dom';
import { APP_ROUTE, AuthorizationStatus } from '../../const';
import MainPage from '../../pages/main-page/main-page';
import LoginPage from '../../pages/login-page/login-page';
import FavoritesPage from '../../pages/favorites-page/favorites-page';
import OfferPage from '../../pages/offer-page/offer-page';
import NotFoundPage from '../../pages/not-found-page/not-found-page';
import PrivateRoute from '../private-route/private-route';
import { HelmetProvider } from 'react-helmet-async';
import { Offer } from '../../types/offer';
import { CARD_OTHER_VIEW } from '../../const';
import { Review } from '../../types/review';
import { Provider } from 'react-redux';
import { store } from '../../store';

type AppProps = {
  cardView: number;
  offers: Offer[];
  reviews: Review[];
}

function App({ cardView, offers, reviews }: AppProps): JSX.Element {
  return (
    <Provider store={store}>
      <HelmetProvider>
        <BrowserRouter>
          <Routes>
            <Route
              index
              path={APP_ROUTE.Root}
              element={<MainPage cardView={cardView} />}
            />
            <Route
              path={APP_ROUTE.Login}
              element={<LoginPage />}
            />
            <Route
              path={APP_ROUTE.Favorites}
              element={
                <PrivateRoute
                  autorizationStatus={AuthorizationStatus.Auth}
                >
                  <FavoritesPage offers={offers} />
                </PrivateRoute>
              }
            />
            <Route
              path={APP_ROUTE.Offer}
              element={
                <OfferPage
                  offers={offers}
                  cardOtherView={CARD_OTHER_VIEW}
                  reviews={reviews}
                />
              }
            />
            <Route
              path='*'
              element={<NotFoundPage />}
            />
          </Routes>
        </BrowserRouter>
      </HelmetProvider>
    </Provider>
  );
}

export default App;
