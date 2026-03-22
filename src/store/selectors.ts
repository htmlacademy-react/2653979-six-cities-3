import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './index';
import { sortOffers } from '../utils/utils';
import { SortType, AuthorizationStatus } from '../const';
import { Offer } from '../types/offer';
import { UserData } from '../types/user-data';
import { Review } from '../types/review';

export const setCity = (state: RootState) => state.city;
export const setOffers = (state: RootState) => state.offers;

export const selectOffersByCity = createSelector(
  [setOffers, setCity],
  (offers, city) => offers.filter((offer) => offer.city.name === city.name)
);

export const selectSortedOffers = createSelector(
  [selectOffersByCity, (state: RootState, sortType: SortType) => sortType],
  (offers, sortType) => sortOffers(offers, sortType)
);

export const selectOffersCount = createSelector(
  [selectOffersByCity],
  (offers) => offers.length
);

export const selectFavoriteOffers = createSelector(
  [(state: RootState) => state.offers],
  (offers) => offers.filter((offer) => offer.isFavorite)
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

export const getAuthorizationStatus = (state: RootState): AuthorizationStatus => state.authorizationStatus;

export const getUserData = (state: RootState): UserData | null => state.userData;

export const getUserEmail = (state: RootState): string | null => state.userData?.email || null;

export const getUserName = (state: RootState): string | null => state.userData?.name || null;

export const getUserAvatar = (state: RootState): string | null => state.userData?.avatarUrl || null;

export const getCurrentOffer = (state: RootState): Offer | null => state.currentOffer;

export const getNearbyOffers = (state: RootState): Offer[] => state.nearbyOffers;

export const getReviews = (state: RootState): Review[] => state.reviews;

export const getIsCurrentOfferLoading = (state: RootState): boolean => state.isCurrentOfferLoading;

export const getIsReviewsLoading = (state: RootState): boolean => state.isReviewsLoading;

export const getIsNearbyLoading = (state: RootState): boolean => state.isNearbyLoading;
