import { render, screen } from '@testing-library/react';
import { withHistory, withStore } from '../../utils/mock-component';
import { AuthorizationStatus, NameSpace, CARD_MODE } from '../../const';
import Card from './card';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { Offer } from '../../types/offer';

vi.mock('../../hooks/use-favorite', () => ({
  useFavorite: () => ({
    toggleFavorite: vi.fn(() => Promise.resolve()),
  }),
}));

vi.mock('../../utils/utils', () => ({
  convertRathingStars: () => '80%',
}));

const fixedOffer: Offer = {
  id: 'test-id',
  title: 'Test title',
  type: 'apartment',
  price: 120,
  isPremium: true,
  isFavorite: true,
  previewImage: 'test.jpg',
  rating: 4,
  goods: [],
  host: { name: 'Host', isPro: false, avatarUrl: '' },
  location: { latitude: 0, longitude: 0, zoom: 10 },
  city: { name: 'Test City', location: { latitude: 0, longitude: 0, zoom: 10 } },
  description: 'Test description',
  bedrooms: 2,
  images: ['img1.jpg', 'img2.jpg'],
  maxAdults: 4,
};

function renderCard({
  authStatus = AuthorizationStatus.Auth,
  offerData = fixedOffer,
}: {
  authStatus?: AuthorizationStatus;
  offerData?: typeof fixedOffer;
} = {}) {
  const initialState = {
    [NameSpace.User]: {
      authorizationStatus: authStatus,
      userData: null,
      favoriteOffers: [],
    },
  };

  const { withStoreComponent } = withStore(
    <Card data={offerData} mode={CARD_MODE.VERTICAL} isNear={false}/>,
    initialState
  );

  return render(withHistory(withStoreComponent));
}

describe('Component: Card', () => {

  it('should render correctly', () => {
    renderCard();

    expect(screen.getByTestId('card-container')).toBeInTheDocument();
    expect(screen.getByText('Test title')).toBeInTheDocument();
    expect(screen.getByText('apartment')).toBeInTheDocument();
    expect(screen.getByText('€120')).toBeInTheDocument();
  });

  it('should render premium mark when isPremium = true', () => {
    renderCard({ offerData: { ...fixedOffer, isPremium: true } });

    expect(screen.getByText('Premium')).toBeInTheDocument();
  });

  it('should not render premium mark when isPremium = false', () => {
    renderCard({ offerData: { ...fixedOffer, isPremium: false } });

    expect(screen.queryByText('Premium')).not.toBeInTheDocument();
  });

  it('should apply active class for favorite when authorized', () => {
    renderCard({ authStatus: AuthorizationStatus.Auth });

    const button = screen.getByRole('button');
    expect(button).toHaveClass('place-card__bookmark-button--active');
  });

  it('should not apply active class when not authorized', () => {
    renderCard({ authStatus: AuthorizationStatus.NoAuth });

    const button = screen.getByRole('button');
    expect(button).not.toHaveClass('place-card__bookmark-button--active');
  });

  it('should handle mouse events', async () => {
    const onMouseEnter = vi.fn();
    const onMouseLeave = vi.fn();

    const initialState = {
      [NameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
        userData: null,
        favoriteOffers: [],
      },
    };

    const { withStoreComponent } = withStore(
      <Card
        data={fixedOffer}
        mode={CARD_MODE.VERTICAL}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        isNear={false}
      />,
      initialState
    );

    render(withHistory(withStoreComponent));

    const card = screen.getByTestId('card-container');

    await userEvent.hover(card);
    expect(onMouseEnter).toHaveBeenCalled();

    await userEvent.unhover(card);
    expect(onMouseLeave).toHaveBeenCalled();
  });

  it('should render correct rating width', () => {
    renderCard();

    const rating = document.querySelector('.place-card__stars span');
    expect(rating).toHaveStyle({ width: '80%' });
  });

});
