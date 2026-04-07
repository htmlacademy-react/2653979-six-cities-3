import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CardsMap from './cards-map';
import { withHistory, withStore } from '../../utils/mock-component';
import { AuthorizationStatus, CITIES, NameSpace, SORT_TYPE } from '../../const';
import { createMockOffer } from '../../utils/mocks';
import * as selectors from '../../store/selectors';
import { vi } from 'vitest';

describe('Component: CardsMap', () => {
  const mockOffers = [createMockOffer(), createMockOffer()];

  const renderCardsMap = (offers = mockOffers, city = CITIES[0], isLoading = false) => {
    const initialState = {
      [NameSpace.Data]: {
        city,
        offers,
        isOffersDataLoading: isLoading,
        currentOffer: null,
        isCurrentOfferLoading: false,
        nearbyOffers: [],
        isNearbyLoading: false,
        reviews: [],
        isReviewsLoading: false,
      },
      [NameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
        userData: null,
        favoriteOffers: []
      },
    };

    vi.spyOn(selectors, 'getCity').mockReturnValue(city);
    vi.spyOn(selectors, 'selectSortedOffers').mockReturnValue(offers);
    vi.spyOn(selectors, 'selectOffersCount').mockReturnValue(offers.length);

    const { withStoreComponent } = withStore(<CardsMap />, initialState);
    render(withHistory(withStoreComponent));

    return { city, offers };
  };

  it('should render places container with offers', () => {
    const { city, offers } = renderCardsMap();

    expect(screen.getByText(`${offers.length} places to stay in ${city.name}`)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /places/i })).toBeInTheDocument();
    expect(screen.getByText(/Sort by/i)).toBeInTheDocument();
    expect(document.querySelector('.cities__map')).toBeInTheDocument();
  });

  it('should render CardsEmpty if no offers and not loading', () => {
    renderCardsMap([], CITIES[0], false);

    expect(screen.getByText('No places to stay available')).toBeInTheDocument();
  });

  it('should not render CardsEmpty if loading', () => {
    renderCardsMap([], CITIES[0], true);

    expect(screen.queryByText('No places to stay available')).not.toBeInTheDocument();
  });

  it('should change sort type when onSortChange is called', async () => {
    renderCardsMap();
    const sortButton = screen.getByText(/Sort by/i);

    await userEvent.click(sortButton);

    const optionsList = screen.getByRole('list');
    const popularOption = within(optionsList).getByText(SORT_TYPE.POPULAR);

    await userEvent.click(popularOption);

    expect(popularOption).toBeInTheDocument();
  });
});
