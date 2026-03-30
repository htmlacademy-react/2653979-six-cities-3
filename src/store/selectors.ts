import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './index';
import { sortOffers } from '../utils/utils';
import { SortType, AuthorizationStatus } from '../const';
import { Offer } from '../types/offer';
import { UserData } from '../types/user-data';
import { Review } from '../types/review';

export const getAuthorizationStatus = (state: RootState): AuthorizationStatus => state.user.authorizationStatus;
export const getUserData = (state: RootState): UserData | null => state.user.userData;
export const getUserEmail = (state: RootState): string | null => state.user.userData?.email || null;
export const getUserName = (state: RootState): string | null => state.user.userData?.name || null;
export const getUserAvatar = (state: RootState): string | null => state.user.userData?.avatarUrl || null;

export const selectFavoriteOffers = (state: RootState): Offer[] => state.user.favoriteOffers;

export const getCity = (state: RootState) => state.data.city;
export const getOffers = (state: RootState) => state.data.offers;
export const getCurrentOffer = (state: RootState): Offer | null => state.data.currentOffer;
export const getNearbyOffers = (state: RootState): Offer[] => state.data.nearbyOffers;
export const getReviews = (state: RootState): Review[] => state.data.reviews;
export const getIsCurrentOfferLoading = (state: RootState): boolean => state.data.isCurrentOfferLoading;
export const getIsReviewsLoading = (state: RootState): boolean => state.data.isReviewsLoading;
export const getIsNearbyLoading = (state: RootState): boolean => state.data.isNearbyLoading;
export const getIsOffersDataLoading = (state: RootState): boolean => state.data.isOffersDataLoading;

export const getError = (state: RootState): string | null => state.error.error;

export const selectOffersByCity = createSelector(
  [getOffers, getCity],
  (offers, city) => offers.filter((offer) => offer.city.name === city.name)
);

export const selectSortedOffers = createSelector(
  [selectOffersByCity, (_state: RootState, sortType: SortType) => sortType],
  (offers, sortType) => sortOffers(offers, sortType)
);

export const selectOffersCount = createSelector(
  [selectOffersByCity],
  (offers) => offers.length
);

export const selectFavoritesByCity = createSelector(
  [selectFavoriteOffers],
  (offers) => {
    const grouped: Record<string, Offer[]> = {};
    offers.forEach((offer) => {
      const city = offer.city.name;
      if (!grouped[city]) {
        grouped[city] = [];
      }
      grouped[city].push(offer);
    });
    return grouped;
  }
);

export const selectHasOffersInCurrentCity = createSelector(
  [selectOffersByCity],
  (offers) => offers.length > 0
);
