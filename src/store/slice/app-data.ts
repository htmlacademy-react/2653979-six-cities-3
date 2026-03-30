import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { City } from '../../types/city';
import { Offer } from '../../types/offer';
import { Review } from '../../types/review';
import { CITIES, NameSpace } from '../../const';
import {
  fetchOffersAction,
  fetchCurrentOfferAction,
  fetchNearbyOffersAction,
  fetchReviewsAction,
  postReviewAction,
  changeFavoriteStatusAction,
} from '../api-actions';

type AppData = {
  city: City;
  offers: Offer[];
  isOffersDataLoading: boolean;
  currentOffer: Offer | null;
  isCurrentOfferLoading: boolean;
  nearbyOffers: Offer[];
  isNearbyLoading: boolean;
  reviews: Review[];
  isReviewsLoading: boolean;
}

const initialState: AppData = {
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

export const appData = createSlice({
  name: NameSpace.Data,
  initialState,
  reducers: {
    setCity: (state, action: PayloadAction<City>) => {
      state.city = action.payload;
    },
    updateOfferFavoriteStatus: (state, action: PayloadAction<{ offerId: string; isFavorite: boolean }>) => {
      const { offerId, isFavorite } = action.payload;
      const offerIndex = state.offers.findIndex((offer) => offer.id === offerId);
      if (offerIndex !== -1) {
        state.offers[offerIndex].isFavorite = isFavorite;
      }

      if (state.currentOffer && state.currentOffer.id === offerId) {
        state.currentOffer.isFavorite = isFavorite;
      }

      const nearbyIndex = state.nearbyOffers.findIndex((offer) => offer.id === offerId);
      if (nearbyIndex !== -1) {
        state.nearbyOffers[nearbyIndex].isFavorite = isFavorite;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOffersAction.pending, (state) => {
        state.isOffersDataLoading = true;
      })
      .addCase(fetchOffersAction.fulfilled, (state, action) => {
        state.offers = action.payload;
        state.isOffersDataLoading = false;
      })
      .addCase(fetchOffersAction.rejected, (state) => {
        state.isOffersDataLoading = false;
      })
      .addCase(fetchCurrentOfferAction.pending, (state) => {
        state.isCurrentOfferLoading = true;
      })
      .addCase(fetchCurrentOfferAction.fulfilled, (state, action) => {
        state.currentOffer = action.payload;
        state.isCurrentOfferLoading = false;
      })
      .addCase(fetchCurrentOfferAction.rejected, (state) => {
        state.currentOffer = null;
        state.isCurrentOfferLoading = false;
      })
      .addCase(fetchNearbyOffersAction.pending, (state) => {
        state.isNearbyLoading = true;
      })
      .addCase(fetchNearbyOffersAction.fulfilled, (state, action) => {
        state.nearbyOffers = action.payload;
        state.isNearbyLoading = false;
      })
      .addCase(fetchNearbyOffersAction.rejected, (state) => {
        state.isNearbyLoading = false;
      })
      .addCase(fetchReviewsAction.pending, (state) => {
        state.isReviewsLoading = true;
      })
      .addCase(fetchReviewsAction.fulfilled, (state, action) => {
        state.reviews = action.payload;
        state.isReviewsLoading = false;
      })
      .addCase(fetchReviewsAction.rejected, (state) => {
        state.isReviewsLoading = false;
      })
      .addCase(postReviewAction.pending, (state) => {
        state.isReviewsLoading = true;
      })
      .addCase(postReviewAction.fulfilled, (state, action) => {
        state.reviews = action.payload;
        state.isReviewsLoading = false;
      })
      .addCase(postReviewAction.rejected, (state) => {
        state.isReviewsLoading = false;
      })
      .addCase(changeFavoriteStatusAction.fulfilled, (state, action) => {
        const updatedOffer = action.payload;
        const { id } = updatedOffer;
        const offerIndex = state.offers.findIndex((offer) => offer.id === id);
        if (offerIndex !== -1) {
          state.offers[offerIndex] = updatedOffer;
        }
        if (state.currentOffer && state.currentOffer.id === id) {
          state.currentOffer = updatedOffer;
        }
        const nearbyIndex = state.nearbyOffers.findIndex((offer) => offer.id === id);
        if (nearbyIndex !== -1) {
          state.nearbyOffers[nearbyIndex] = updatedOffer;
        }
      });
  }
});

export const { setCity, updateOfferFavoriteStatus } = appData.actions;
