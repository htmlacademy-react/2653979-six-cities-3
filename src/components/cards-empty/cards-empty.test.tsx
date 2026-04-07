import { render, screen } from '@testing-library/react';
import CardsEmpty from './cards-empty';
import { withStore } from '../../utils/mock-component';
import { CITIES, NameSpace } from '../../const';

describe('Component: CardsEmpty', () => {
  const renderCardsEmpty = (city = CITIES[0]) => {
    const initialState = {
      [NameSpace.Data]: {
        city,
        offers: [],
        isOffersDataLoading: false,
        currentOffer: null,
        isCurrentOfferLoading: true,
        nearbyOffers: [],
        isNearbyLoading: false,
        reviews: [],
        isReviewsLoading: false,
      },
    };

    const { withStoreComponent } = withStore(<CardsEmpty />, initialState);
    render(withStoreComponent);

    return city;
  };

  it('should render the empty cards container', () => {
    const city = renderCardsEmpty();

    expect(screen.getByText('No places to stay available')).toBeInTheDocument();
    expect(
      screen.getByText(
        `We could not find any property available at the moment in ${city.name}`
      )
    ).toBeInTheDocument();
    expect(document.querySelector('.cities__places-container')).toBeInTheDocument();
  });

  it('should render dynamic city name', () => {
    const city = renderCardsEmpty(CITIES[1]);

    expect(
      screen.getByText(
        `We could not find any property available at the moment in ${city.name}`
      )
    ).toBeInTheDocument();
  });
});
