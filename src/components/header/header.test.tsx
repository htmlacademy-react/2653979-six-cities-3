import { render, screen } from '@testing-library/react';
import Header from './header';
import { withStore, withHistory } from '../../utils/mock-component';
import { AuthorizationStatus, APP_ROUTE } from '../../const';
import * as selectors from '../../store/selectors';
import { vi } from 'vitest';
import * as router from 'react-router-dom';
import { createMockOffer } from '../../utils/mocks';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
    useLocation: vi.fn(),
  };
});

describe('Component: Header', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.spyOn(selectors, 'getAuthorizationStatus').mockReturnValue(AuthorizationStatus.NoAuth);
    vi.spyOn(selectors, 'selectFavoriteOffers').mockReturnValue([]);
    vi.spyOn(selectors, 'getUserEmail').mockReturnValue('test@example.com');

    vi.mocked(router.useNavigate).mockReturnValue(mockNavigate);
    vi.clearAllMocks();
  });

  const renderHeader = (pathname = APP_ROUTE.Root) => {
    const { withStoreComponent } = withStore(<Header />);

    vi.mocked(router.useLocation).mockReturnValue({
      pathname,
      search: '',
      hash: '',
      state: null,
      key: 'test-key',
    });

    render(withHistory(withStoreComponent));
  };

  it('renders logo link', () => {
    renderHeader();
    const logoLink = screen.getByRole('link', { name: /6 cities logo/i });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute('href', APP_ROUTE.Root);
  });

  it('does not render nav on login page', () => {
    renderHeader(APP_ROUTE.Login);
    expect(screen.queryByText(/sign in/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/sign out/i)).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /6 cities logo/i })).toBeInTheDocument();
  });

  it('renders auth nav when user is authorized', () => {
    vi.spyOn(selectors, 'getAuthorizationStatus').mockReturnValue(AuthorizationStatus.Auth);
    vi.spyOn(selectors, 'selectFavoriteOffers').mockReturnValue([createMockOffer(), createMockOffer()]);
    renderHeader();

    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText(/sign out/i)).toBeInTheDocument();
  });

  it('renders login link when user is not authorized', () => {
    renderHeader();
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  });
});
