import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserData } from '../../types/user-data';
import { AuthorizationStatus, NameSpace } from '../../const';
import { checkAuthAction, fetchFavoriteOffersAction, loginAction, logoutAction } from '../api-actions';
import { Offer } from '../../types/offer';

type UserProcess = {
  authorizationStatus: AuthorizationStatus;
  userData: UserData | null;
  favoriteOffers: Offer[];
}

const initialState: UserProcess = {
  authorizationStatus: AuthorizationStatus.Unknown,
  userData: null,
  favoriteOffers: [],
};

export const userProcess = createSlice({
  name: NameSpace.User,
  initialState,
  reducers: {
    updateFavoriteInUserSlice: (state, action: PayloadAction<{ offerId: string; isFavorite: boolean }>) => {
      const { offerId, isFavorite } = action.payload;

      if (isFavorite) {
        const existingOffer = state.favoriteOffers.find((offer) => offer.id === offerId);
        if (existingOffer) {
          existingOffer.isFavorite = isFavorite;
        }
      } else {
        state.favoriteOffers = state.favoriteOffers.filter((offer) => offer.id !== offerId);
      }
    },
    addToFavoriteOffers: (state, action: PayloadAction<Offer>) => {
      const offer = action.payload;
      const exists = state.favoriteOffers.some((o) => o.id === offer.id);
      if (!exists) {
        state.favoriteOffers.push(offer);
      } else {
        const index = state.favoriteOffers.findIndex((o) => o.id === offer.id);
        if (index !== -1) {
          state.favoriteOffers[index] = offer;
        }
      }
    },
    removeFromFavoriteOffers: (state, action: PayloadAction<string>) => {
      state.favoriteOffers = state.favoriteOffers.filter((offer) => offer.id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuthAction.fulfilled, (state, action) => {
        state.authorizationStatus = AuthorizationStatus.Auth;
        state.userData = action.payload;
      })
      .addCase(checkAuthAction.rejected, (state) => {
        state.authorizationStatus = AuthorizationStatus.NoAuth;
        state.userData = null;
        state.favoriteOffers = [];
      })
      .addCase(loginAction.fulfilled, (state, action) => {
        state.authorizationStatus = AuthorizationStatus.Auth;
        state.userData = action.payload;
      })
      .addCase(loginAction.rejected, (state) => {
        state.authorizationStatus = AuthorizationStatus.NoAuth;
        state.userData = null;
        state.favoriteOffers = [];
      })
      .addCase(logoutAction.fulfilled, (state) => {
        state.authorizationStatus = AuthorizationStatus.NoAuth;
        state.userData = null;
        state.favoriteOffers = [];
      })
      .addCase(fetchFavoriteOffersAction.fulfilled, (state, action) => {
        state.favoriteOffers = action.payload;
      })
      .addCase(fetchFavoriteOffersAction.rejected, (state) => {
        state.favoriteOffers = [];
      });
  }
});

export const { updateFavoriteInUserSlice, addToFavoriteOffers, removeFromFavoriteOffers } = userProcess.actions;
