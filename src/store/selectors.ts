import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './index';
import { sortOffers } from '../utils/utils';
import { SortType, AuthorizationStatus, NameSpace } from '../const';
import { Offer } from '../types/offer';
import { UserData } from '../types/user-data';
import { Review } from '../types/review';

export const getAuthorizationStatus = (state: Pick<RootState, NameSpace.User>): AuthorizationStatus => state[NameSpace.User].authorizationStatus;
export const getUserData = (state: Pick<RootState, NameSpace.User>): UserData | null => state[NameSpace.User].userData;
export const getUserEmail = (state: Pick<RootState, NameSpace.User>): string | null => state[NameSpace.User].userData?.email || null;
export const getUserName = (state: Pick<RootState, NameSpace.User>): string | null => state[NameSpace.User].userData?.name || null;
export const getUserAvatar = (state: Pick<RootState, NameSpace.User>): string | null => state[NameSpace.User].userData?.avatarUrl || null;

export const selectFavoriteOffers = (state: Pick<RootState, NameSpace.User>): Offer[] => state[NameSpace.User].favoriteOffers;

export const getCity = (state: Pick<RootState, NameSpace.Data>) => state[NameSpace.Data].city;
export const getOffers = (state: Pick<RootState, NameSpace.Data>) => state[NameSpace.Data].offers;
export const getCurrentOffer = (state: Pick<RootState, NameSpace.Data>): Offer | null => state[NameSpace.Data].currentOffer;
export const getNearbyOffers = (state: Pick<RootState, NameSpace.Data>): Offer[] => state[NameSpace.Data].nearbyOffers;
export const getReviews = (state: Pick<RootState, NameSpace.Data>): Review[] => state[NameSpace.Data].reviews;
export const getIsCurrentOfferLoading = (state: Pick<RootState, NameSpace.Data>): boolean => state[NameSpace.Data].isCurrentOfferLoading;
export const getIsReviewsLoading = (state: Pick<RootState, NameSpace.Data>): boolean => state[NameSpace.Data].isReviewsLoading;
export const getIsNearbyLoading = (state: Pick<RootState, NameSpace.Data>): boolean => state[NameSpace.Data].isNearbyLoading;
export const getIsOffersDataLoading = (state: Pick<RootState, NameSpace.Data>): boolean => state[NameSpace.Data].isOffersDataLoading;

export const getError = (state: Pick<RootState, NameSpace.Error>): string | null => state[NameSpace.Error].error;

export const selectOffersByCity = createSelector(
  [getOffers, getCity],
  (offers, city) => offers.filter((offer) => offer.city.name === city.name)
);

export const selectSortedOffers = createSelector(
  [selectOffersByCity, (_state: Pick<RootState, NameSpace.Data>, sortType: SortType) => sortType],
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
