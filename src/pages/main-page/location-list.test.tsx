import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LocationList from './location-list';
import { vi } from 'vitest';
import * as storeHooks from '../../store';
import * as apiActions from '../../store/api-actions';
import * as appActions from '../../store/slice/app-data';
import { AuthorizationStatus, CITIES, NameSpace } from '../../const';

vi.mock('./location-item', () => ({
  default: ({ city, isActive, onClick }: {
    city: { name: string };
    isActive: boolean;
    onClick: () => void;
  }) => (
    <li>
      <button
        data-testid="location-item"
        data-active={isActive}
        onClick={onClick}
      >
        {city.name}
      </button>
    </li>
  ),
}));

vi.mock('../../store', () => ({
  useAppDispatch: vi.fn(),
  useAppSelector: vi.fn(),
}));

vi.mock('../../store/api-actions');
vi.mock('../../store/slice/app-data');

describe('Component: LocationList', () => {
  const dispatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(storeHooks.useAppDispatch).mockReturnValue(dispatch);

    vi.mocked(storeHooks.useAppSelector).mockImplementation((selector) =>
      selector({
        [NameSpace.User]: {
          authorizationStatus: AuthorizationStatus.Auth,
          userData: null,
          favoriteOffers: [],
        },
        [NameSpace.Data]: {
          city: CITIES[0],
          offers: [],
          isOffersDataLoading: false,
          currentOffer: null,
          isCurrentOfferLoading: false,
          nearbyOffers: [],
          isNearbyLoading: false,
          reviews: [],
          isReviewsLoading: false,
        },
        [NameSpace.Error]: {
          error: null,
        },
      })
    );
  });

  it('should render all cities', () => {
    render(<LocationList />);

    expect(screen.getAllByTestId('location-item')).toHaveLength(CITIES.length);
  });

  it('should mark current city as active', () => {
    vi.mocked(storeHooks.useAppSelector).mockImplementation((selector) =>
      selector({
        [NameSpace.User]: {
          authorizationStatus: AuthorizationStatus.Auth,
          userData: null,
          favoriteOffers: [],
        },
        [NameSpace.Data]: {
          city: CITIES[1],
          offers: [],
          isOffersDataLoading: false,
          currentOffer: null,
          isCurrentOfferLoading: false,
          nearbyOffers: [],
          isNearbyLoading: false,
          reviews: [],
          isReviewsLoading: false,
        },
        [NameSpace.Error]: {
          error: null,
        },
      })
    );

    render(<LocationList />);

    const items = screen.getAllByTestId('location-item');

    expect(items[1]).toHaveAttribute('data-active', 'true');
    expect(items[0]).toHaveAttribute('data-active', 'false');
  });

  it('should dispatch fetchOffersAction on mount', () => {
    const mockFetch = vi.fn();

    vi.mocked(apiActions.fetchOffersAction).mockReturnValue(mockFetch);

    render(<LocationList />);

    expect(dispatch).toHaveBeenCalledWith(mockFetch);
  });

  it('should dispatch setCity on click', async () => {
    const user = userEvent.setup();

    vi.mocked(appActions.setCity).mockImplementation((city) => ({
      type: 'DATA/setCity',
      payload: city,
    }));

    render(<LocationList />);

    const items = screen.getAllByTestId('location-item');

    await user.click(items[2]);

    expect(appActions.setCity).toHaveBeenCalledWith(CITIES[2]);
    expect(dispatch).toHaveBeenCalled();
  });
});
