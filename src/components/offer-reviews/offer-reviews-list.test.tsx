import { render, screen } from '@testing-library/react';
import { describe, it, beforeEach, expect, vi } from 'vitest';
import OfferReviewsList from './offer-reviews-list';
import { AuthorizationStatus, REVIEW_LIMIT } from '../../const';
import { useAppSelector } from '../../store';
import { getAuthorizationStatus, getReviews } from '../../store/selectors';
import { Review } from '../../types/review';

vi.mock('../../store', () => ({
  useAppSelector: vi.fn(),
}));

vi.mock('./offer-reviews-item', () => ({
  __esModule: true,
  default: vi.fn(() => <li data-testid="review-item" />),
}));

vi.mock('./offer-reviews-form', () => ({
  __esModule: true,
  default: vi.fn(() => <div data-testid="reviews-form" />),
}));

describe('OfferReviewsList', () => {
  const mockReviews: Review[] = [
    {
      id: '1',
      user: { name: 'Alice', avatarUrl: 'avatar1.jpg', isPro: true },
      rating: 5,
      comment: 'Amazing!',
      date: '2023-04-09T12:00:00.000Z',
    },
    {
      id: '2',
      user: { name: 'Bob', avatarUrl: 'avatar2.jpg', isPro: false },
      rating: 4,
      comment: 'Good!',
      date: '2023-04-08T12:00:00.000Z',
    },
  ];

  let useAppSelectorMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    useAppSelectorMock = useAppSelector as unknown as ReturnType<typeof vi.fn>;
    vi.clearAllMocks();
  });

  it('renders the correct number of review items', () => {
    useAppSelectorMock.mockImplementation((selector) => {
      if (selector === getReviews) {
        return mockReviews;
      }
      if (selector === getAuthorizationStatus) {
        return AuthorizationStatus.NoAuth;
      }
      return null;
    });

    render(<OfferReviewsList />);
    expect(screen.getAllByTestId('review-item').length).toBe(mockReviews.length);
  });

  it('renders ReviewsForm if user is authorized', () => {
    useAppSelectorMock.mockImplementation((selector) => {
      if (selector === getReviews) {
        return mockReviews;
      }
      if (selector === getAuthorizationStatus) {
        return AuthorizationStatus.Auth;
      }
      return null;
    });

    render(<OfferReviewsList />);
    expect(screen.getByTestId('reviews-form')).toBeInTheDocument();
  });

  it('does not render ReviewsForm if user is not authorized', () => {
    useAppSelectorMock.mockImplementation((selector) => {
      if (selector === getReviews) {
        return mockReviews;
      }
      if (selector === getAuthorizationStatus) {
        return AuthorizationStatus.NoAuth;
      }
      return null;
    });

    render(<OfferReviewsList />);
    expect(screen.queryByTestId('reviews-form')).toBeNull();
  });

  it('limits the number of displayed reviews to REVIEW_LIMIT.REVIEWS_COUNT', () => {
    const manyReviews = Array.from({ length: REVIEW_LIMIT.REVIEWS_COUNT + 2 }, (_, i) => ({
      id: `${i}`,
      user: { name: `User${i}`, avatarUrl: `avatar${i}.jpg`, isPro: false },
      rating: 3,
      comment: 'Test',
      date: '2023-04-01T12:00:00.000Z',
    }));

    useAppSelectorMock.mockImplementation((selector) => {
      if (selector === getReviews) {
        return manyReviews;
      }
      if (selector === getAuthorizationStatus) {
        return AuthorizationStatus.NoAuth;
      }
      return null;
    });

    render(<OfferReviewsList />);
    expect(screen.getAllByTestId('review-item').length).toBe(REVIEW_LIMIT.REVIEWS_COUNT);
  });
});
