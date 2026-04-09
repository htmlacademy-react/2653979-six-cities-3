import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, beforeEach, vi, expect } from 'vitest';
import ReviewsForm from './offer-reviews-form';
import { useAppDispatch, useAppSelector } from '../../store';
import { postReviewAction } from '../../store/api-actions';
import { getCurrentOffer } from '../../store/selectors';
import { REVIEW_LIMIT } from '../../const';
import { Offer } from '../../types/offer';

vi.mock('../../store', () => ({
  useAppDispatch: vi.fn(),
  useAppSelector: vi.fn(),
}));

vi.mock('../../store/api-actions', () => ({
  postReviewAction: vi.fn(),
}));

vi.mock('../../store/selectors', () => ({
  getCurrentOffer: vi.fn(),
}));

describe('ReviewsForm', () => {
  type DispatchReturn = { unwrap: () => Promise<void> };
  let mockDispatch: ReturnType<typeof vi.fn> & { (): DispatchReturn };

  beforeEach(() => {
    const mockUnwrap = vi.fn(() => Promise.resolve());

    mockDispatch = vi.fn(() => ({ unwrap: mockUnwrap }));

    const useAppDispatchMock = useAppDispatch as unknown as jest.MockedFunction<typeof useAppDispatch>;
    useAppDispatchMock.mockReturnValue(mockDispatch);

    const useAppSelectorMock = useAppSelector as unknown as jest.MockedFunction<typeof useAppSelector>;
    useAppSelectorMock.mockImplementation((selector) => selector === getCurrentOffer ? { id: '1' } as Offer : null);

    vi.clearAllMocks();
  });

  it('renders rating inputs and textarea', () => {
    render(<ReviewsForm />);
    const stars = screen.getAllByRole('radio');
    const textarea = screen.getByPlaceholderText(/tell how was your stay/i);
    expect(stars.length).toBe(5);
    expect(textarea).toBeInTheDocument();
  });

  it('disables submit button if rating or review is invalid', () => {
    render(<ReviewsForm />);
    const submitBtn = screen.getByRole('button', { name: /submit/i });
    expect(submitBtn).toBeDisabled();
  });

  it('enables submit button when rating and review meet requirements', () => {
    render(<ReviewsForm />);
    const textarea = screen.getByPlaceholderText(/tell how was your stay/i);
    const firstStar = screen.getByTitle(/perfect/i);

    fireEvent.click(firstStar);
    fireEvent.change(textarea, { target: { value: 'a'.repeat(REVIEW_LIMIT.MIN) } });

    const submitBtn = screen.getByRole('button', { name: /submit/i });
    expect(submitBtn).toBeEnabled();
  });

  it('dispatches postReviewAction on submit', () => {
    render(<ReviewsForm />);
    const textarea = screen.getByPlaceholderText(/tell how was your stay/i);
    const firstStar = screen.getByTitle(/perfect/i);
    const submitBtn = screen.getByRole('button', { name: /submit/i });

    fireEvent.click(firstStar);
    fireEvent.change(textarea, { target: { value: 'a'.repeat(REVIEW_LIMIT.MIN) } });
    fireEvent.click(submitBtn);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(postReviewAction).toHaveBeenCalledWith({
      offerId: '1',
      review: { comment: 'a'.repeat(REVIEW_LIMIT.MIN), rating: 5 },
    });
  });
});
