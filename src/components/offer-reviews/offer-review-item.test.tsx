import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import OfferReviewsItem from './offer-reviews-item';
import { Review } from '../../types/review';
import * as utils from '../../utils/utils';

describe('OfferReviewsItem', () => {
  const mockReview: Review = {
    user: {
      name: 'John Doe',
      avatarUrl: 'avatar.jpg',
      isPro: false,
    },
    id: '1',
    rating: 4,
    date: '2023-04-09T12:00:00.000Z',
    comment: 'Great stay!',
  };

  it('renders user name and avatar', () => {
    render(<OfferReviewsItem data={mockReview} />);

    const userName = screen.getByText('John Doe');
    expect(userName).toBeInTheDocument();

    const avatar = screen.getByAltText('Reviews avatar') ;
    expect(avatar).toBeInTheDocument();
  });

  it('renders the comment', () => {
    render(<OfferReviewsItem data={mockReview} />);
    expect(screen.getByText('Great stay!')).toBeInTheDocument();
  });

  it('renders the rating as width percentage', () => {
    render(<OfferReviewsItem data={mockReview} />);
    const ratingSpan = screen.getByText('Rating').previousSibling as HTMLElement;
    expect(ratingSpan.style.width).toBe(`${mockReview.rating * 20}%`);
  });

  it('renders the formatted date', () => {
    const formattedDate = 'April 9, 2023';
    const getReviewDateSpy = vitest.spyOn(utils, 'getReviewDate').mockReturnValue(formattedDate);

    render(<OfferReviewsItem data={mockReview} />);
    const dateElement = screen.getByText(formattedDate);
    expect(dateElement).toBeInTheDocument();

    getReviewDateSpy.mockRestore();
  });
});
