import { createReducer } from '@reduxjs/toolkit';
import { AuthorizationStatus, CITIES } from '../const';
import {
  requireAuthorization, setCity, setCurrentOffer, setCurrentOfferLoadStatus,
  setError, setNearbyLoadStatus, setNearbyOffers, setOfferList,
  setOfferLoadStatus, setReviews, setReviewsLoadStatus, setUserData
} from './action';
import { City } from '../types/city';
import { Offer } from '../types/offer';
import { UserData } from '../types/user-data';
import { Review } from '../types/review';

type State = {
  city: City;
  offers: Offer[];
  authorizationStatus: AuthorizationStatus;
  isOffersDataLoading: boolean;
  error: string | null;
  userData: UserData | null;
  currentOffer: Offer | null;
  nearbyOffers: Offer[];
  reviews: Review[];
  isCurrentOfferLoading: boolean;
  isReviewsLoading: boolean;
  isNearbyLoading: boolean;
}

const initialState: State = {
  city: CITIES[0],
  offers: [],
  authorizationStatus: AuthorizationStatus.Unknown,
  isOffersDataLoading: false,
  error: null,
  userData: null,
  currentOffer: null,
  nearbyOffers: [],
  reviews: [],
  isCurrentOfferLoading: true,
  isReviewsLoading: false,
  isNearbyLoading: false,
};

const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setCity, (state, action) => {
      state.city = action.payload;
    })
    .addCase(setOfferList, (state, action) => {
      state.offers = action.payload;
    })
    .addCase(requireAuthorization, (state, action) => {
      state.authorizationStatus = action.payload;
    })
    .addCase(setError, (state, action) => {
      state.error = action.payload;
    })
    .addCase(setOfferLoadStatus, (state, action) => {
      state.isOffersDataLoading = action.payload;
    })
    .addCase(setUserData, (state, action) => {
      state.userData = action.payload;
    })
    .addCase(setCurrentOffer, (state, action) => {
      state.currentOffer = action.payload;
    })
    .addCase(setNearbyOffers, (state, action) => {
      state.nearbyOffers = action.payload;
    })
    .addCase(setReviews, (state, action) => {
      state.reviews = Array.isArray(action.payload) ? action.payload : [];
    })
    .addCase(setCurrentOfferLoadStatus, (state, action) => {
      state.isCurrentOfferLoading = action.payload;
    })
    .addCase(setReviewsLoadStatus, (state, action) => {
      state.isReviewsLoading = action.payload;
    })
    .addCase(setNearbyLoadStatus, (state, action) => {
      state.isNearbyLoading = action.payload;
    });
});

export { reducer };
