import { CITIES } from '../../const';
import { createMockOffer, createMockReview, generateRandomNumber } from '../../utils/mocks';
import {
  changeFavoriteStatusAction,
  fetchCurrentOfferAction,
  fetchNearbyOffersAction,
  fetchOffersAction,
  fetchReviewsAction,
  postReviewAction
} from '../api-actions';
import {
  appData,
  setCity,
  updateOfferFavoriteStatus
} from './app-data';

describe('AppData slice', () => {
  const initialState = {
    city: CITIES[0],
    offers: [],
    isOffersDataLoading: false,
    currentOffer: null,
    isCurrentOfferLoading: true,
    nearbyOffers: [],
    isNearbyLoading: false,
    reviews: [],
    isReviewsLoading: false,
  };

  const mockOffer = createMockOffer();
  const mockOffers = [createMockOffer(), createMockOffer()];
  const mockNearbyOffers = [createMockOffer(), createMockOffer()];
  const mockReviews = [createMockReview(), createMockReview()];

  describe('Reducers', () => {
    it('should return initial state with empty action', () => {
      const emptyAction = { type: '' };
      const result = appData.reducer(undefined, emptyAction);
      expect(result).toEqual(initialState);
    });


    describe('setCity', () => {
      it('should set city correctly', () => {
        const newCity = CITIES[generateRandomNumber(0, (CITIES.length - 1))];
        const action = setCity(newCity);
        const result = appData.reducer(initialState, action);

        expect(result.city).toEqual(newCity);
        expect(result.city).not.toEqual(CITIES[0]);
      });
    });

    describe('updateOfferFavoriteStatus', () => {
      it('should update favorite status in offers array', () => {
        const offer = { ...mockOffer, id: 'offer-1', isFavorite: false };
        const state = {
          ...initialState,
          offers: [offer],
        };
        const action = updateOfferFavoriteStatus({ offerId: 'offer-1', isFavorite: true });
        const result = appData.reducer(state, action);

        expect(result.offers[0].isFavorite).toBe(true);
      });

      it('should update favorite status in currentOffer if matches', () => {
        const offer = { ...mockOffer, id: 'offer-1', isFavorite: false };
        const state = {
          ...initialState,
          currentOffer: offer,
        };
        const action = updateOfferFavoriteStatus({ offerId: 'offer-1', isFavorite: true });
        const result = appData.reducer(state, action);

        expect(result.currentOffer?.isFavorite).toBe(true);
      });

      it('should update favorite status in nearbyOffers if matches', () => {
        const offer = { ...mockOffer, id: 'offer-1', isFavorite: false };
        const state = {
          ...initialState,
          nearbyOffers: [offer],
        };
        const action = updateOfferFavoriteStatus({ offerId: 'offer-1', isFavorite: true });
        const result = appData.reducer(state, action);

        expect(result.nearbyOffers[0].isFavorite).toBe(true);
      });

      it('should update all occurrences of the offer', () => {
        const offer = { ...mockOffer, id: 'offer-1', isFavorite: false };
        const state = {
          ...initialState,
          offers: [offer],
          currentOffer: offer,
          nearbyOffers: [offer],
        };
        const action = updateOfferFavoriteStatus({ offerId: 'offer-1', isFavorite: true });
        const result = appData.reducer(state, action);

        expect(result.offers[0].isFavorite).toBe(true);
        expect(result.currentOffer?.isFavorite).toBe(true);
        expect(result.nearbyOffers[0].isFavorite).toBe(true);
      });

      it('should not modify state if offer not found anywhere', () => {
        const state = {
          ...initialState,
          offers: [mockOffer],
          currentOffer: mockOffer,
          nearbyOffers: [mockOffer],
        };
        const action = updateOfferFavoriteStatus({ offerId: 'non-existent', isFavorite: true });
        const result = appData.reducer(state, action);

        expect(result).toEqual(state);
      });
    });
  });

  describe('ExtraReducers', () => {
    describe('fetchOffersAction', () => {
      it('should set loading to true when pending', () => {
        const action = fetchOffersAction.pending('', undefined);
        const result = appData.reducer(initialState, action);

        expect(result.isOffersDataLoading).toBe(true);
        expect(result.offers).toHaveLength(0);
      });

      it('should set offers and loading to false when fulfilled', () => {
        const action = fetchOffersAction.fulfilled(mockOffers, '', undefined);
        const result = appData.reducer(initialState, action);

        expect(result.offers).toEqual(mockOffers);
        expect(result.isOffersDataLoading).toBe(false);
      });

      it('should set loading to false when rejected', () => {
        const stateWithLoading = { ...initialState, isOffersDataLoading: true };
        const action = fetchOffersAction.rejected(null, '', undefined);
        const result = appData.reducer(stateWithLoading, action);

        expect(result.isOffersDataLoading).toBe(false);
        expect(result.offers).toHaveLength(0);
      });
    });

    describe('fetchCurrentOfferAction', () => {
      it('should set loading to true when pending', () => {
        const action = fetchCurrentOfferAction.pending('', 'offer-id');
        const result = appData.reducer(initialState, action);

        expect(result.isCurrentOfferLoading).toBe(true);
      });

      it('should set currentOffer and loading to false when fulfilled', () => {
        const action = fetchCurrentOfferAction.fulfilled(mockOffer, '', 'offer-id');
        const result = appData.reducer(initialState, action);

        expect(result.currentOffer).toEqual(mockOffer);
        expect(result.isCurrentOfferLoading).toBe(false);
      });

      it('should set currentOffer to null and loading to false when rejected', () => {
        const stateWithLoading = { ...initialState, isCurrentOfferLoading: true, currentOffer: mockOffer };
        const action = fetchCurrentOfferAction.rejected(null, '', 'offer-id');
        const result = appData.reducer(stateWithLoading, action);

        expect(result.currentOffer).toBeNull();
        expect(result.isCurrentOfferLoading).toBe(false);
      });
    });

    describe('fetchNearbyOffersAction', () => {
      it('should set loading to true when pending', () => {
        const action = fetchNearbyOffersAction.pending('', 'offer-id');
        const result = appData.reducer(initialState, action);

        expect(result.isNearbyLoading).toBe(true);
      });

      it('should set nearbyOffers and loading to false when fulfilled', () => {
        const action = fetchNearbyOffersAction.fulfilled(mockNearbyOffers, '', 'offer-id');
        const result = appData.reducer(initialState, action);

        expect(result.nearbyOffers).toEqual(mockNearbyOffers);
        expect(result.isNearbyLoading).toBe(false);
      });

      it('should set loading to false when rejected', () => {
        const stateWithLoading = { ...initialState, isNearbyLoading: true };
        const action = fetchNearbyOffersAction.rejected(null, '', 'offer-id');
        const result = appData.reducer(stateWithLoading, action);

        expect(result.isNearbyLoading).toBe(false);
        expect(result.nearbyOffers).toHaveLength(0);
      });
    });

    describe('fetchReviewsAction', () => {
      it('should set loading to true when pending', () => {
        const action = fetchReviewsAction.pending('', 'offer-id');
        const result = appData.reducer(initialState, action);

        expect(result.isReviewsLoading).toBe(true);
      });

      it('should set reviews and loading to false when fulfilled', () => {
        const action = fetchReviewsAction.fulfilled(mockReviews, '', 'offer-id');
        const result = appData.reducer(initialState, action);

        expect(result.reviews).toEqual(mockReviews);
        expect(result.isReviewsLoading).toBe(false);
      });

      it('should set loading to false when rejected', () => {
        const stateWithLoading = { ...initialState, isReviewsLoading: true };
        const action = fetchReviewsAction.rejected(null, '', 'offer-id');
        const result = appData.reducer(stateWithLoading, action);

        expect(result.isReviewsLoading).toBe(false);
        expect(result.reviews).toHaveLength(0);
      });
    });

    describe('postReviewAction', () => {
      const reviewData = {
        offerId: 'offer-id',
        review: { comment: 'Great place!', rating: 5 }
      };

      it('should set loading to true when pending', () => {
        const action = postReviewAction.pending('', reviewData);
        const result = appData.reducer(initialState, action);

        expect(result.isReviewsLoading).toBe(true);
      });

      it('should set reviews and loading to false when fulfilled', () => {
        const action = postReviewAction.fulfilled(mockReviews, '', reviewData);
        const result = appData.reducer(initialState, action);

        expect(result.reviews).toEqual(mockReviews);
        expect(result.isReviewsLoading).toBe(false);
      });

      it('should set loading to false when rejected', () => {
        const stateWithLoading = { ...initialState, isReviewsLoading: true };
        const action = postReviewAction.rejected(null, '', reviewData);
        const result = appData.reducer(stateWithLoading, action);

        expect(result.isReviewsLoading).toBe(false);
      });
    });

    describe('changeFavoriteStatusAction', () => {
      const updatedOffer = { ...mockOffer, id: 'offer-1', isFavorite: true };
      const actionPayload = { offerId: 'offer-1', status: 1 };

      it('should update offer in offers array when fulfilled', () => {
        const oldOffer = { ...mockOffer, id: 'offer-1', isFavorite: false };
        const state = {
          ...initialState,
          offers: [oldOffer],
        };
        const action = changeFavoriteStatusAction.fulfilled(updatedOffer, '', actionPayload);
        const result = appData.reducer(state, action);

        expect(result.offers[0]).toEqual(updatedOffer);
        expect(result.offers[0].isFavorite).toBe(true);
      });

      it('should update currentOffer when fulfilled and matches', () => {
        const oldOffer = { ...mockOffer, id: 'offer-1', isFavorite: false };
        const state = {
          ...initialState,
          currentOffer: oldOffer,
        };
        const action = changeFavoriteStatusAction.fulfilled(updatedOffer, '', actionPayload);
        const result = appData.reducer(state, action);

        expect(result.currentOffer).toEqual(updatedOffer);
        expect(result.currentOffer?.isFavorite).toBe(true);
      });

      it('should update nearbyOffers when fulfilled and matches', () => {
        const oldOffer = { ...mockOffer, id: 'offer-1', isFavorite: false };
        const state = {
          ...initialState,
          nearbyOffers: [oldOffer],
        };
        const action = changeFavoriteStatusAction.fulfilled(updatedOffer, '', actionPayload);
        const result = appData.reducer(state, action);

        expect(result.nearbyOffers[0]).toEqual(updatedOffer);
        expect(result.nearbyOffers[0].isFavorite).toBe(true);
      });

      it('should update all occurrences of the offer in all arrays', () => {
        const oldOffer = { ...mockOffer, id: 'offer-1', isFavorite: false };
        const state = {
          ...initialState,
          offers: [oldOffer],
          currentOffer: oldOffer,
          nearbyOffers: [oldOffer],
        };
        const action = changeFavoriteStatusAction.fulfilled(updatedOffer, '', actionPayload);
        const result = appData.reducer(state, action);

        expect(result.offers[0]).toEqual(updatedOffer);
        expect(result.currentOffer).toEqual(updatedOffer);
        expect(result.nearbyOffers[0]).toEqual(updatedOffer);
      });

      it('should not modify state if offer not found in any array', () => {
        const state = {
          ...initialState,
          offers: [mockOffer],
          currentOffer: mockOffer,
          nearbyOffers: [mockOffer],
        };
        const action = changeFavoriteStatusAction.fulfilled(
          { ...updatedOffer, id: 'different-id' },
          '',
          actionPayload
        );
        const result = appData.reducer(state, action);

        expect(result.offers[0]).toEqual(mockOffer);
        expect(result.currentOffer).toEqual(mockOffer);
        expect(result.nearbyOffers[0]).toEqual(mockOffer);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty offers array when updating favorite status', () => {
      const action = updateOfferFavoriteStatus({ offerId: 'any-id', isFavorite: true });
      const result = appData.reducer(initialState, action);

      expect(result.offers).toHaveLength(0);
      expect(result.currentOffer).toBeNull();
      expect(result.nearbyOffers).toHaveLength(0);
    });

    it('should handle null currentOffer when updating favorite status', () => {
      const state = {
        ...initialState,
        currentOffer: null,
      };
      const action = updateOfferFavoriteStatus({ offerId: 'any-id', isFavorite: true });
      const result = appData.reducer(state, action);

      expect(result.currentOffer).toBeNull();
    });

    it('should preserve other state properties when updating', () => {
      const state = {
        ...initialState,
        city: CITIES[1],
        isOffersDataLoading: true,
      };
      const action = setCity(CITIES[2]);
      const result = appData.reducer(state, action);

      expect(result.city).toEqual(CITIES[2]);
      expect(result.isOffersDataLoading).toBe(true);
      expect(result.offers).toEqual([]);
    });
  });
});
