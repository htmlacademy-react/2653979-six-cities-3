import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OfferList from './offer-list';
import { createMockOffer } from '../../utils/mocks';
import { vi } from 'vitest';
import { withStore, withHistory } from '../../utils/mock-component';
import { AuthorizationStatus, NameSpace } from '../../const';

describe('Component: OfferList', () => {
  const mockOffers = Array.from({ length: 5 }, () => createMockOffer());
  const onActiveCardToggle = vi.fn();

  const renderOfferList = (authorizationStatus = AuthorizationStatus.Auth, isLoading = false, cardView = 3) => {
    const initialState = {
      [NameSpace.User]: {
        authorizationStatus,
        userData: null,
        favoriteOffers: [],
      },
      [NameSpace.Data]: {
        isOffersDataLoading: isLoading,
        isCurrentOfferLoading: false,
        isNearbyLoading: false,
        isReviewsLoading: false,
        offers: mockOffers,
        city: mockOffers[0].city,
        currentOffer: null,
        nearbyOffers: [],
        reviews: [],
      },
      [NameSpace.Error]: {
        error: null,
      },
    };

    const { withStoreComponent } = withStore(
      <OfferList cardView={cardView} offers={mockOffers} onActiveCardToggle={onActiveCardToggle} />,
      initialState
    );

    render(withHistory(withStoreComponent));
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders spinner when authorization status is Unknown', () => {
    renderOfferList(AuthorizationStatus.Unknown, false);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders spinner when offers are loading', () => {
    renderOfferList(AuthorizationStatus.Auth, true);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders correct number of cards according to cardView', () => {
    renderOfferList(AuthorizationStatus.Auth, false, 3);
    const cards = screen.getAllByTestId('card-container');
    expect(cards).toHaveLength(3);
  });

  it('calls onActiveCardToggle on mouse enter and leave', async () => {
    renderOfferList(AuthorizationStatus.Auth, false, 1);
    const card = screen.getByTestId('card-container');

    await userEvent.hover(card);
    expect(onActiveCardToggle).toHaveBeenCalledWith(mockOffers[0].id);

    await userEvent.unhover(card);
    expect(onActiveCardToggle).toHaveBeenCalledWith(null);
  });
});
