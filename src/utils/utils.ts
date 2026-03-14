import { SORT_TYPE } from '../const';
import { Offer } from '../types/offer';

export function getReviewDate(date: string): string {
  return new Date(date).toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

export function sortOffers(offers: Offer[], sortType: string): Offer[] {
  const sortedOffers = [...offers];
  switch (sortType) {
    case SORT_TYPE.PRICE_HIGH_TO_LOW:
      return sortedOffers.sort((a, b) => b.price - a.price);
    case SORT_TYPE.PRICE_LOW_TO_HIGH:
      return sortedOffers.sort((a, b) => a.price - b.price);
    case SORT_TYPE.TOP_RATED:
      return sortedOffers.sort((a, b) => a.rating - b.rating);
    case SORT_TYPE.POPULAR:
    default:
      return sortedOffers;
  }
}
