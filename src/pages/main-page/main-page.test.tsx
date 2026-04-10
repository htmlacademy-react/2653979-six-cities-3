import { render, screen, waitFor } from '@testing-library/react';
import { withHistory, withStore } from '../../utils/mock-component';
import MainPage from './main-page';
import { vi } from 'vitest';
import { AuthorizationStatus, NameSpace } from '../../const';
import * as selectors from '../../store/selectors';

vi.mock('../../store/selectors');

vi.mock('../../components/header/header', () => ({
  default: () => <div data-testid="header">Header</div>,
}));

vi.mock('./location-list', () => ({
  default: () => <div data-testid="location-list">LocationList</div>,
}));

vi.mock('../../components/cities/cards-map', () => ({
  default: () => <div data-testid="cards-map">CardsMap</div>,
}));

describe('Component: MainPage', () => {
  const mockSelectHasOffers =
    vi.mocked(selectors.selectHasOffersInCurrentCity);

  function renderMainPage(hasOffers: boolean) {
    mockSelectHasOffers.mockReturnValue(hasOffers);

    const initialState = {
      [NameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
        userData: null,
        favoriteOffers: [],
      },
    };

    const { withStoreComponent } = withStore(
      <MainPage />,
      initialState
    );

    return render(withHistory(withStoreComponent));
  }

  it('should render correctly with offers', () => {
    renderMainPage(true);

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('location-list')).toBeInTheDocument();
    expect(screen.getByTestId('cards-map')).toBeInTheDocument();
    expect(screen.getByText('Cities')).toBeInTheDocument();
  });

  it('should NOT have empty class when offers exist', () => {
    renderMainPage(true);

    const main = document.querySelector('.page__main');
    expect(main).not.toHaveClass('page__main--index-empty');
  });

  it('should have empty class when no offers', () => {
    renderMainPage(false);

    const main = document.querySelector('.page__main');
    expect(main).toHaveClass('page__main--index-empty');
  });

  it('should set correct document title', async () => {
    renderMainPage(true);

    await waitFor(() => {
      expect(document.title).toBe('6 Cities');
    });
  });
});
