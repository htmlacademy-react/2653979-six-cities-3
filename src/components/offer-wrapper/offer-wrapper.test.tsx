import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import OfferWrapper from './offer-wrapper';
import { Offer } from '../../types/offer';
import { useFavorite } from '../../hooks/use-favorite';
import { convertRathingStars } from '../../utils/utils';
import { CITIES } from '../../const';
import { createMockLocation } from '../../utils/mocks';

vi.mock('../../hooks/use-favorite', () => ({
  useFavorite: vi.fn(),
}));

vi.mock('../../utils/utils', () => ({
  convertRathingStars: vi.fn(),
}));

vi.mock('../offer-reviews/offer-reviews-list', () => ({
  __esModule: true,
  default: vi.fn(() => <div data-testid="reviews-list" />),
}));

describe('OfferWrapper', () => {
  const mockOffer: Offer = {
    id: '1',
    title: 'Beautiful Apartment',
    type: 'apartment',
    isPremium: true,
    rating: 4,
    bedrooms: 2,
    maxAdults: 4,
    price: 120,
    goods: ['Wi-Fi', 'Kitchen'],
    host: { name: 'Alice', avatarUrl: 'host.jpg', isPro: true },
    description: 'A lovely place to stay.',
    isFavorite: false,
    city: CITIES[0],
    images: [],
    location: createMockLocation(),
    previewImage: 'prev'
  };

  const toggleFavoriteMock = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    (useFavorite as unknown as Mock).mockReturnValue({
      toggleFavorite: toggleFavoriteMock,
    });

    (convertRathingStars as unknown as Mock).mockReturnValue('80%');

    vi.clearAllMocks();
  });

  it('renders title, premium mark and rating', () => {
    render(<OfferWrapper offerData={mockOffer} />);
    expect(screen.getByText('Beautiful Apartment')).toBeInTheDocument();
    expect(screen.getByText('Premium')).toBeInTheDocument();
    const ratingSpan = screen.getByText('Rating').previousSibling as HTMLElement;
    expect(ratingSpan.style.width).toBe('80%');
  });

  it('renders price and features', () => {
    render(<OfferWrapper offerData={mockOffer} />);
    expect(screen.getByText('€120')).toBeInTheDocument();
    expect(screen.getByText('apartment')).toBeInTheDocument();
    expect(screen.getByText('2 Bedrooms')).toBeInTheDocument();
    expect(screen.getByText('Max 4 adults')).toBeInTheDocument();
  });

  it('renders host information', () => {
    render(<OfferWrapper offerData={mockOffer} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Pro')).toBeInTheDocument();
    expect(screen.getByAltText('Host avatar')).toHaveAttribute('src', 'host.jpg');
  });

  it('renders goods inside the offer', () => {
    render(<OfferWrapper offerData={mockOffer} />);
    expect(screen.getByText('Wi-Fi')).toBeInTheDocument();
    expect(screen.getByText('Kitchen')).toBeInTheDocument();
  });

  it('renders the reviews list component', () => {
    render(<OfferWrapper offerData={mockOffer} />);
    expect(screen.getByTestId('reviews-list')).toBeInTheDocument();
  });

  it('calls toggleFavorite on favorite button click', () => {
    render(<OfferWrapper offerData={mockOffer} />);
    const favButton = screen.getByRole('button', { name: /To bookmarks/i });
    fireEvent.click(favButton);
    expect(toggleFavoriteMock).toHaveBeenCalledWith('1', false);
  });

  it('adds active class if isFavorite is true', () => {
    render(<OfferWrapper offerData={{ ...mockOffer, isFavorite: true }} />);
    const favButton = screen.getByRole('button', { name: /To bookmarks/i });
    expect(favButton.className).toContain('offer__bookmark-button--active');
  });
});

