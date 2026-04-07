import { render, screen, waitFor } from '@testing-library/react';
import FavoritesPage from './favorites-page';
import { vi } from 'vitest';
import * as store from '../../store';
import { selectFavoritesByCity } from '../../store/selectors';
import { withHistory, withStore } from '../../utils/mock-component';
import { Offer } from '../../types/offer';
import { createMockOffer } from '../../utils/mocks';

vi.mock('../../components/header/header', () => ({ default: vi.fn(() => <header>Header</header>) }));
vi.mock('../../components/footer/footer', () => ({ default: vi.fn(() => <footer>Footer</footer>) }));
vi.mock('../../components/card/card', () => ({
  default: vi.fn(({ data }: { data: { id: string; title: string } }) => (
    <div>{data.title}</div>
  )),
}));

describe('Component: FavoritesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });


  type FavoritesByCity = Record<string, Offer[]>;

  const renderFavoritesPage = (favoritesByCity: FavoritesByCity = {}) => {
    vi.spyOn(store, 'useAppSelector').mockImplementation((selector) =>
      selector === selectFavoritesByCity ? favoritesByCity : undefined
    );

    const { withStoreComponent } = withStore(<FavoritesPage />, {});
    render(withHistory(withStoreComponent));
  };

  it('renders Header, Footer and empty favorites state when no favorites', () => {
    renderFavoritesPage({});

    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();

    expect(screen.getByText('Nothing yet saved.')).toBeInTheDocument();
    expect(screen.getByText(/Save properties/i)).toBeInTheDocument();
  });

  it('renders favorites grouped by cities when favorites exist', () => {
    const favoritesMock: Record<string, Offer[]> = {
      'Amsterdam': [{ ...createMockOffer(), title: 'Amsterdam House' }],
      'Paris': [{ ...createMockOffer(), title: 'Paris Apartment', city: { name: 'Paris', location: { latitude: 0, longitude: 0, zoom: 0 } } }],
    };

    renderFavoritesPage(favoritesMock);

    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();

    const cities = screen.getAllByRole('link', { name: /Amsterdam|Paris/ });
    expect(cities[0]).toHaveTextContent('Amsterdam');
    expect(cities[1]).toHaveTextContent('Paris');

    expect(screen.getByText('Amsterdam House')).toBeInTheDocument();
    expect(screen.getByText('Paris Apartment')).toBeInTheDocument();
  });

  it('renders Helmet title correctly', async () => {
    renderFavoritesPage({});

    await waitFor(() => {
      expect(document.title).toBe('Favorites');
    });
  });
});
