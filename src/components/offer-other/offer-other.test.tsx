import { render, screen } from '@testing-library/react';
import OfferOther from './offer-other';
import { CARD_MODE } from '../../const';
import { createMockOffer } from '../../utils/mocks';
import { Offer } from '../../types/offer';
import { vi } from 'vitest';

vi.mock('../card/card', () => ({
  default: ({ data, mode }: { data: Offer; mode: typeof CARD_MODE[keyof typeof CARD_MODE] }) => (
    <div data-testid="card" data-title={data.title} data-mode={mode}></div>
  ),
}));

describe('Component: OfferOther', () => {
  const mockOffers: Offer[] = Array.from({ length: 5 }, () => createMockOffer());

  it('renders container and title', () => {
    render(<OfferOther cardOtherView={3} offers={mockOffers} />);
    expect(screen.getByText(/Other places in the neighbourhood/i)).toBeInTheDocument();
  });

  it('renders correct number of cards according to cardOtherView', () => {
    render(<OfferOther cardOtherView={3} offers={mockOffers} />);
    const cards = screen.getAllByTestId('card');
    expect(cards).toHaveLength(3);
  });

  it('renders all cards if cardOtherView greater than offers length', () => {
    render(<OfferOther cardOtherView={10} offers={mockOffers} />);
    const cards = screen.getAllByTestId('card');
    expect(cards).toHaveLength(mockOffers.length);
  });

  it('passes correct props to Card', () => {
    render(<OfferOther cardOtherView={2} offers={mockOffers} />);
    const cards = screen.getAllByTestId('card');
    cards.forEach((card, index) => {
      expect(card.dataset.title).toBe(mockOffers[index].title);
      expect(card.dataset.mode).toBe(CARD_MODE.VERTICAL);
    });
  });

  it('renders nothing when offers array is empty', () => {
    render(<OfferOther cardOtherView={3} offers={[]} />);
    const cards = screen.queryAllByTestId('card');
    expect(cards).toHaveLength(0);
  });
});
