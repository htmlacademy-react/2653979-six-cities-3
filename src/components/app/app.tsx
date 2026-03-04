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
import { City } from '../../types/city';
import { CARD_OTHER_VIEW } from '../../const';

type AppProps = {
  cardView: number;
  offerCount: number;
  cities: City[];
  offers: Offer[];
}

function App({ cardView, offerCount, cities, offers }: AppProps): JSX.Element {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route
            index
            path={APP_ROUTE.Root}
            element={<MainPage cardView={cardView} offerCount={offerCount} cities={cities} offers={offers} />}
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
                <FavoritesPage offers={offers}/>
              </PrivateRoute>
            }
          />
          <Route
            path={APP_ROUTE.Offer}
            element={<OfferPage offers={offers} cardOtherView={CARD_OTHER_VIEW} />}
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
