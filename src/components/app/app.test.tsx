import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './app';
import { AuthorizationStatus, NameSpace } from '../../const';
import { withHistory, withStore } from '../../utils/mock-component';
import { State } from '../../types/state';

vi.mock('../../pages/main-page/main-page', () => ({
  default: () => <div>Main Page Mock</div>
}));

vi.mock('../../pages/login-page/login-page', () => ({
  default: () => <div>Login Page Mock</div>
}));

vi.mock('../../pages/favorites-page/favorites-page', () => ({
  default: () => <div>Favorites Page Mock</div>
}));

vi.mock('../../pages/offer-page/offer-page', () => ({
  default: () => <div>Offer Page Mock</div>
}));

vi.mock('../../pages/not-found-page/not-found-page', () => ({
  default: () => <div>Not Found Page Mock</div>
}));

vi.mock('../private-route/private-route', () => ({
  default: ({ children, autorizationStatus }: { children: JSX.Element; autorizationStatus: AuthorizationStatus }) => (
    <div>
      {autorizationStatus === AuthorizationStatus.Auth
        ? children
        : <div>Redirect to Login</div>}
    </div>
  )
}));

vi.mock('../../store/api-actions', async () => {
  const actual = await vi.importActual<typeof import('../../store/api-actions')>(
    '../../store/api-actions'
  );

  const createMockThunk = (type: string) => {
    const thunk = vi.fn(() => () => Promise.resolve());

    return Object.assign(thunk, {
      pending: { type: `${type}/pending` },
      fulfilled: { type: `${type}/fulfilled` },
      rejected: { type: `${type}/rejected` },
    });
  };

  return {
    ...actual,
    checkAuthAction: createMockThunk('auth/checkAuth'),
    fetchFavoriteOffersAction: createMockThunk('favorites/fetchFavoriteOffers'),
    clearErrorAction: createMockThunk('error/clearError'),
  };
});

function renderWithProviders(
  component: JSX.Element,
  initialState: Partial<State>,
  route: string
) {
  const { withStoreComponent } = withStore(component, initialState);

  return render(
    withHistory(withStoreComponent, [route])
  );
}

describe('App Routing', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Public routes', () => {

    it('should render MainPage when navigate to "/"', () => {
      const initialState = {
        [NameSpace.User]: {
          authorizationStatus: AuthorizationStatus.Unknown,
          userData: null,
          favoriteOffers: []
        }
      };

      renderWithProviders(<App />, initialState, '/');

      expect(screen.getByText('Main Page Mock')).toBeInTheDocument();
    });

    it('should render LoginPage when navigate to "/login"', () => {
      const initialState = {
        [NameSpace.User]: {
          authorizationStatus: AuthorizationStatus.Unknown,
          userData: null,
          favoriteOffers: []
        }
      };

      renderWithProviders(<App />, initialState, '/login');

      expect(screen.getByText('Login Page Mock')).toBeInTheDocument();
    });

  });

  describe('Private routes', () => {

    it('should render FavoritesPage for authorized user', () => {
      const initialState = {
        [NameSpace.User]: {
          authorizationStatus: AuthorizationStatus.Auth,
          userData: null,
          favoriteOffers: []
        }
      };

      renderWithProviders(<App />, initialState, '/favorites');

      expect(screen.getByText('Favorites Page Mock')).toBeInTheDocument();
    });

    it('should redirect to login for unauthorized user', () => {
      const initialState = {
        [NameSpace.User]: {
          authorizationStatus: AuthorizationStatus.NoAuth,
          userData: null,
          favoriteOffers: []
        }
      };

      renderWithProviders(<App />, initialState, '/favorites');

      expect(screen.getByText('Redirect to Login')).toBeInTheDocument();
    });

  });

  describe('Not found route', () => {

    it('should render NotFoundPage for unknown route', () => {
      const initialState = {
        [NameSpace.User]: {
          authorizationStatus: AuthorizationStatus.Unknown,
          userData: null,
          favoriteOffers: []
        }
      };

      renderWithProviders(<App />, initialState, '/some-unknown-route');

      expect(screen.getByText('Not Found Page Mock')).toBeInTheDocument();
    });

  });

});
