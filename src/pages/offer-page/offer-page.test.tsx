import { render, screen } from '@testing-library/react';
import { describe, it, beforeEach, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import OfferPage from './offer-page';
import { useAppDispatch, useAppSelector } from '../../store';
import { getCurrentOffer, getIsCurrentOfferLoading, getNearbyOffers } from '../../store/selectors';
import { fetchCurrentOfferAction, fetchNearbyOffersAction, fetchReviewsAction } from '../../store/api-actions';
import { APP_ROUTE, CARD_OTHER_VIEW } from '../../const';
import type { Offer } from '../../types/offer';
import type { AppTunkDispatch } from '../../utils/mocks';

vi.mock('../../store', () => ({
  useAppDispatch: vi.fn(),
  useAppSelector: vi.fn(),
}));

vi.mock('../../store/api-actions', () => ({
  fetchCurrentOfferAction: vi.fn(),
  fetchNearbyOffersAction: vi.fn(),
  fetchReviewsAction: vi.fn(),
}));

vi.mock('../../components/header/header', () => ({
  __esModule: true,
  default: () => <div data-testid="header" />,
}));

vi.mock('../../components/offer-gallery/offer-gallery', () => ({
  __esModule: true,
  default: () => <div data-testid="offer-gallery" />,
}));

vi.mock('../../components/offer-wrapper/offer-wrapper', () => ({
  __esModule: true,
  default: () => <div data-testid="offer-wrapper" />,
}));

vi.mock('../../components/offer-other/offer-other', () => ({
  __esModule: true,
  default: () => <div data-testid="offer-other" data-view={CARD_OTHER_VIEW} />,
}));

vi.mock('../../components/map/map', () => ({
  __esModule: true,
  default: () => <div data-testid="map" />,
}));

vi.mock('../../components/spinner/spinner', () => ({
  __esModule: true,
  default: () => <div data-testid="spinner" />,
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: '1' }),
    Navigate: ({ to }: { to: string }) => <div data-testid="navigate">{to}</div>,
  };
});

describe('OfferPage', () => {
  let useAppDispatchMock: jest.MockedFunction<typeof useAppDispatch>;
  let useAppSelectorMock: jest.MockedFunction<typeof useAppSelector>;

  const mockOffer: Offer = {
    id: '1',
    title: 'Test Offer',
    images: ['img1', 'img2'],
    city: { name: 'City', location: { latitude: 0, longitude: 0, zoom: 10 } },
    type: 'apartment',
    isPremium: true,
    rating: 4,
    bedrooms: 2,
    maxAdults: 4,
    price: 100,
    goods: [],
    host: { name: 'Alice', avatarUrl: 'host.jpg', isPro: true },
    description: 'Nice place',
    isFavorite: false,
    previewImage: 'prev',
    location: { latitude: 0, longitude: 0, zoom: 10 },
  };

  const mockNearbyOffers: Offer[] = [mockOffer];
  let mockDispatch: AppTunkDispatch;

  beforeEach(() => {
    vi.clearAllMocks();

    const mockUnwrap = vi.fn(() => Promise.resolve());
    mockDispatch = vi.fn(() => ({ unwrap: mockUnwrap }));
    useAppDispatchMock = useAppDispatch as unknown as jest.MockedFunction<typeof useAppDispatch>;
    useAppDispatchMock.mockReturnValue(mockDispatch);

    useAppSelectorMock = useAppSelector as unknown as jest.MockedFunction<typeof useAppSelector>;
    useAppSelectorMock.mockImplementation((selector) => {
      if (selector === getCurrentOffer) {
        return mockOffer;
      }
      if (selector === getNearbyOffers) {
        return mockNearbyOffers;
      }
      if (selector === getIsCurrentOfferLoading) {
        return false;
      }
      return undefined;
    });
  });

  const renderPage = () =>
    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={[`${APP_ROUTE.Offer}/1`]}>
          <Routes>
            <Route path={`${APP_ROUTE.Offer}/:id`} element={<OfferPage />} />
          </Routes>
        </MemoryRouter>
      </HelmetProvider>
    );

  it('renders all main components when offer is loaded', () => {
    renderPage();

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('offer-gallery')).toBeInTheDocument();
    expect(screen.getByTestId('offer-wrapper')).toBeInTheDocument();
    expect(screen.getByTestId('map')).toBeInTheDocument();
    expect(screen.getByTestId('offer-other')).toBeInTheDocument();

    expect(mockDispatch).toHaveBeenCalledWith(fetchCurrentOfferAction('1'));
    expect(mockDispatch).toHaveBeenCalledWith(fetchReviewsAction('1'));
    expect(mockDispatch).toHaveBeenCalledWith(fetchNearbyOffersAction('1'));
  });

  it('renders Spinner when offer is loading', () => {
    useAppSelectorMock.mockImplementation((selector) => {
      if (selector === getIsCurrentOfferLoading) {
        return true;
      }
      if (selector === getCurrentOffer) {
        return undefined;
      }
      return undefined;
    });

    renderPage();

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(screen.queryByTestId('offer-wrapper')).not.toBeInTheDocument();
  });

  it('renders Navigate when current offer is null', () => {
    useAppSelectorMock.mockImplementation((selector) => {
      if (selector === getCurrentOffer) {
        return undefined;
      }
      if (selector === getIsCurrentOfferLoading) {
        return false;
      }
      return undefined;
    });

    renderPage();

    expect(screen.getByTestId('navigate')).toHaveTextContent(APP_ROUTE.Root);
  });

  it('does not render gallery when images array is empty', () => {
    useAppSelectorMock.mockImplementation((selector) => {
      if (selector === getCurrentOffer) {
        return { ...mockOffer, images: [] };
      }
      if (selector === getNearbyOffers) {
        return mockNearbyOffers;
      }
      if (selector === getIsCurrentOfferLoading) {
        return false;
      }
      return undefined;
    });

    renderPage();

    expect(screen.queryByTestId('offer-gallery')).not.toBeInTheDocument();
  });
});

