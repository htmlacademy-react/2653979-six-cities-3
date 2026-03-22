import { createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch, store } from '.';
import { State } from '../types/state';
import { AxiosInstance } from 'axios';
import { Offer } from '../types/offer';
import { APIRoute, AuthorizationStatus, TIMEOUT_SHOW_ERROR } from '../const';
import { requireAuthorization, setCurrentOffer, setCurrentOfferLoadStatus, setError, setNearbyLoadStatus, setNearbyOffers, setOfferList, setOfferLoadStatus, setReviews, setReviewsLoadStatus, setUserData } from './action';
import { dropToken, saveToken } from '../services/token';
import { AuthData } from '../types/auth-data';
import { UserData } from '../types/user-data';
import { Review, ReviewPost } from '../types/review';
import { AxiosError } from 'axios';

export const fetchOfferAction = createAsyncThunk<void, undefined, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'data/fetchOffers',
  async (_arg, { dispatch, extra: api }) => {
    dispatch(setOfferLoadStatus(true));
    const { data } = await api.get<Offer[]>(APIRoute.Offers);
    dispatch(setOfferLoadStatus(false));
    dispatch(setOfferList(data));
  },
);

export const checkAuthAction = createAsyncThunk<void, undefined, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'user/checkAuth',
  async (_arg, { dispatch, extra: api }) => {
    try {
      const { data } = await api.get<UserData>(APIRoute.Login);
      dispatch(requireAuthorization(AuthorizationStatus.Auth));
      dispatch(setUserData(data));
    } catch {
      dispatch(requireAuthorization(AuthorizationStatus.NoAuth));
      dispatch(setUserData(null));
    }
  },
);

export const loginAction = createAsyncThunk<void, AuthData, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'user/login',
  async ({ login: email, password }, { dispatch, extra: api }) => {
    const { data } = await api.post<UserData>(APIRoute.Login, { email, password });
    saveToken(data.token);
    dispatch(requireAuthorization(AuthorizationStatus.Auth));
    dispatch(setUserData(data));
  },
);

export const logoutAction = createAsyncThunk<void, undefined, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'user/logout',
  async (_arg, { dispatch, extra: api }) => {
    await api.delete(APIRoute.Logout);
    dropToken();
    dispatch(requireAuthorization(AuthorizationStatus.NoAuth));
    dispatch(setUserData(null));
  },
);

export const clearErrorAction = createAsyncThunk(
  'clearError',
  () => {
    setTimeout(
      () => store.dispatch(setError(null)),
      TIMEOUT_SHOW_ERROR,
    );
  },
);

export const fetchCurrentOfferAction = createAsyncThunk<void, string, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'data/fetchCurrentOffer',
  async (offerId, { dispatch, extra: api }) => {
    dispatch(setCurrentOfferLoadStatus(true));
    try {
      const { data } = await api.get<Offer>(`${APIRoute.Offers}/${offerId}`);
      dispatch(setCurrentOffer(data));
    } catch (error) {
      dispatch(setCurrentOffer(null));
      throw error;
    } finally {
      dispatch(setCurrentOfferLoadStatus(false));
    }
  },
);

export const fetchReviewsAction = createAsyncThunk<void, string, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'data/fetchReviews',
  async (offerId, { dispatch, extra: api }) => {
    dispatch(setReviewsLoadStatus(true));
    try {
      const { data } = await api.get<Review[]>(`${APIRoute.Comments}/${offerId}`);
      dispatch(setReviews(data));
    } finally {
      dispatch(setReviewsLoadStatus(false));
    }
  },
);

export const postReviewAction = createAsyncThunk<
  void,
  { offerId: string; review: ReviewPost },
  {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
    rejectValue: string;
  }
>(
  'data/postReview',
  async ({ offerId, review }, { dispatch, extra: api, rejectWithValue }) => {
    try {
      const url = `${APIRoute.Comments}/${offerId}`;
      await api.post<Review>(url, review);
      const { data: updatedReviews } = await api.get<Review[]>(url);
      dispatch(setReviews(updatedReviews));
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 400) {
        return rejectWithValue('Invalid review data');
      }
      return rejectWithValue('Failed to submit review');
    }
  },
);

export const fetchNearbyOffersAction = createAsyncThunk<void, string, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'data/fetchNearbyOffers',
  async (offerId, { dispatch, extra: api }) => {
    dispatch(setNearbyLoadStatus(true));
    try {
      const { data } = await api.get<Offer[]>(`${APIRoute.Offers}/${offerId}/nearby`);
      dispatch(setNearbyOffers(data));
    } finally {
      dispatch(setNearbyLoadStatus(false));
    }
  },
);
