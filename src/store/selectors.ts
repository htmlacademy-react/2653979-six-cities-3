import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './index';
import { sortOffers } from '../utils/utils';
import { SortType } from '../const';

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
