import { SORT_TYPE } from '../const';
import { mockOffersForSorting } from './mocks';
import { getReviewDate, sortOffers } from './utils';

describe('Utils tests', () => {

  describe('Function: getReviewDate', () => {
    it('should date is correct', () => {
      const testDate = new Date(2023, 2, 15);
      const mockDate = testDate.toISOString();

      const result = getReviewDate(mockDate);

      expect(result).toBe('March 2023');
    });
  });


  describe('Function: sortOffers', () => {
    describe('should sort by PRICE_LOW_TO_HIGH', () => {
      it('should sort offers by price in ascending order', () => {
        const result = sortOffers(mockOffersForSorting.differentPrices, SORT_TYPE.PRICE_LOW_TO_HIGH);

        const prices = result.map((offer) => offer.price);
        expect(prices).toEqual([50, 100, 200, 300, 500]);
      });
    });

    describe('should sort by PRICE_HIGH_TO_LOW', () => {
      it('should sort offers by price in descending order', () => {
        const result = sortOffers(mockOffersForSorting.differentPrices, SORT_TYPE.PRICE_HIGH_TO_LOW);

        const prices = result.map((offer) => offer.price);
        expect(prices).toEqual([500, 300, 200, 100, 50]);
      });
    });

    describe('should sort by TOP_RATED', () => {
      it('should sort offers by rating in ascending order', () => {
        const result = sortOffers(mockOffersForSorting.differentRatings, SORT_TYPE.TOP_RATED);

        const ratings = result.map((offer) => offer.rating);
        expect(ratings).toEqual([5.0, 4.5, 3.5, 2.5, 1.5 ]);
      });
    });

  });
});
