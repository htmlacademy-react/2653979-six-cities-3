import { createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch } from '.';
import { State } from '../types/state';
import { AxiosInstance } from 'axios';
import { Offer } from '../types/offer';
import { APIRoute, TIMEOUT_SHOW_ERROR } from '../const';
import { dropToken, saveToken } from '../services/token';
import { AuthData } from '../types/auth-data';
import { UserData } from '../types/user-data';
import { Review, ReviewPost } from '../types/review';
import { AxiosError } from 'axios';
import { setError } from './slice/app-error';
import { updateOfferFavoriteStatus } from './slice/app-data';
import { addToFavoriteOffers, removeFromFavoriteOffers } from './slice/user-process';

export const fetchOffersAction = createAsyncThunk<Offer[], undefined, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'data/fetchOffers',
  async (_arg, { extra: api }) => {
    const { data } = await api.get<Offer[]>(APIRoute.Offers);
    return data;
  },
);

export const checkAuthAction = createAsyncThunk<UserData, undefined, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'user/checkAuth',
  async (_arg, { extra: api }) => {
    const { data } = await api.get<UserData>(APIRoute.Login);
    return data;
  },
);

export const logoutAction = createAsyncThunk<void, undefined, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'user/logout',
  async (_arg, { extra: api }) => {
    await api.delete(APIRoute.Logout);
    dropToken();
  },
);

export const clearErrorAction = createAsyncThunk<void, void, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'error/clearError',
  async (_, { dispatch }) => {
    await new Promise((resolve) => {
      setTimeout(resolve, TIMEOUT_SHOW_ERROR);
    });
    dispatch(setError(null));
  },
);

export const fetchCurrentOfferAction = createAsyncThunk<Offer, string, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'data/fetchCurrentOffer',
  async (offerId, { extra: api }) => {
    const { data } = await api.get<Offer>(`${APIRoute.Offers}/${offerId}`);
    return data;
  },
);

export const fetchReviewsAction = createAsyncThunk<Review[], string, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'data/fetchReviews',
  async (offerId, { extra: api }) => {
    const { data } = await api.get<Review[]>(`${APIRoute.Comments}/${offerId}`);
    return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },
);

export const postReviewAction = createAsyncThunk<Review[], { offerId: string; review: ReviewPost }, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
  rejectValue: string;
}>(
  'data/postReview',
  async ({ offerId, review }, { extra: api, rejectWithValue }) => {
    try {
      const url = `${APIRoute.Comments}/${offerId}`;
      await api.post<Review>(url, review);
      const { data } = await api.get<Review[]>(url);
      return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 400) {
        return rejectWithValue('Invalid review data');
      }
      return rejectWithValue('Failed to submit review');
    }
  },
);

export const fetchNearbyOffersAction = createAsyncThunk<Offer[], string, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'data/fetchNearbyOffers',
  async (offerId, { extra: api }) => {
    const { data } = await api.get<Offer[]>(`${APIRoute.Offers}/${offerId}/nearby`);
    return data;
  },
);

export const changeFavoriteStatusAction = createAsyncThunk<Offer, { offerId: string; status: number }, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'data/changeFavoriteStatus',
  async ({ offerId, status }, { extra: api }) => {
    const { data } = await api.post<Offer>(`${APIRoute.Favorite}/${offerId}/${status}`);
    return data;
  },
);


export const toggleFavoriteAction = createAsyncThunk<void, { offerId: string; isFavorite: boolean }, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'data/toggleFavorite',
  async ({ offerId, isFavorite }, { dispatch, extra: api }) => {
    const newStatus = isFavorite ? 0 : 1;
    const { data } = await api.post<Offer>(`${APIRoute.Favorite}/${offerId}/${newStatus}`);
    dispatch(updateOfferFavoriteStatus({
      offerId: data.id,
      isFavorite: data.isFavorite
    }));
    if (data.isFavorite) {
      dispatch(addToFavoriteOffers(data));
    } else {
      // Удаляем из избранного
      dispatch(removeFromFavoriteOffers(offerId));
    }
  }
);

export const fetchFavoriteOffersAction = createAsyncThunk<Offer[], undefined, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'data/fetchFavoriteOffers',
  async (_arg, { extra: api }) => {
    const { data } = await api.get<Offer[]>(APIRoute.Favorite);
    return data;
  },
);

export const loginAction = createAsyncThunk<UserData, AuthData, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'user/login',
  async ({ login: email, password }, { dispatch, extra: api }) => {
    const { data } = await api.post<UserData>(APIRoute.Login, { email, password });
    saveToken(data.token);
    dispatch(fetchFavoriteOffersAction());
    return data;
  },
);
