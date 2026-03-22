import { createAction } from '@reduxjs/toolkit';
import { City } from '../types/city';
import { Offer } from '../types/offer';
import { AuthorizationStatus } from '../const';
import { UserData } from '../types/user-data';
import { Review } from '../types/review';

export const setCity = createAction<City>('setCity');
export const setOfferList = createAction<Offer[]>('setOfferList');
export const requireAuthorization = createAction<AuthorizationStatus>('user/requireAuthorization');
export const setError = createAction<string | null>('error');
export const setOfferLoadStatus = createAction<boolean>('setOfferLoad');
export const setUserData = createAction<UserData | null>('user/setUserData');

export const setCurrentOffer = createAction<Offer | null>('setCurrentOffer');
export const setNearbyOffers = createAction<Offer[]>('setNearbyOffers');
export const setReviews = createAction<Review[]>('setReviews');
export const setReviewsLoadStatus = createAction<boolean>('setReviewsLoad');
export const setNearbyLoadStatus = createAction<boolean>('setNearbyLoad');
export const setCurrentOfferLoadStatus = createAction<boolean>('setCurrentOfferLoad');
