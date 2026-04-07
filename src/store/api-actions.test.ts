import { vi } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import axios, { AxiosInstance } from 'axios';
import { AnyAction } from '@reduxjs/toolkit';

vi.mock('../services/api', () => ({
  createAPI: vi.fn((): AxiosInstance => {
    const instance = axios.create({
      baseURL: 'https://test.com',
      timeout: 5000,
    });
    return instance;
  })
}));

import { createAPI } from '../services/api';
import thunk from 'redux-thunk';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { Action } from 'redux';
import { State } from '../types/state';
import { AppTunkDispatch, extractActionsTypes, createMockOffer, createMockReview, createMockUserData } from '../utils/mocks';
import { APIRoute, AuthorizationStatus, CITIES, NameSpace } from '../const';
import {
  checkAuthAction,
  fetchOffersAction,
  logoutAction,
  fetchCurrentOfferAction,
  fetchReviewsAction,
  postReviewAction,
  fetchNearbyOffersAction,
  changeFavoriteStatusAction,
  toggleFavoriteAction,
  fetchFavoriteOffersAction,
  loginAction
} from './api-actions';
import { saveToken, dropToken } from '../services/token';
import { updateOfferFavoriteStatus } from './slice/app-data';
import { addToFavoriteOffers, removeFromFavoriteOffers } from './slice/user-process';

vi.mock('../services/token', () => ({
  saveToken: vi.fn(),
  dropToken: vi.fn(),
}));

describe('Async actions', () => {
  const axiosInstance = createAPI();
  const mockAxiosAdapter = new MockAdapter(axiosInstance);
  const middleware = [thunk.withExtraArgument(axiosInstance)];
  const mockStoreCreator = configureMockStore<State, Action<string>, AppTunkDispatch>(middleware);

  let store: ReturnType<typeof mockStoreCreator>;

  const mockOffer = createMockOffer();
  const mockUserData = createMockUserData();
  const mockReview = createMockReview();

  beforeEach(() => {
    store = mockStoreCreator({
      [NameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Unknown,
        userData: null,
        favoriteOffers: [],
      },
      [NameSpace.Data]: {
        city: CITIES[0],
        offers: [],
        isOffersDataLoading: false,
        currentOffer: null,
        isCurrentOfferLoading: true,
        nearbyOffers: [],
        isNearbyLoading: false,
        reviews: [],
        isReviewsLoading: false,
      },
      [NameSpace.Error]: {
        error: null,
      },
    });

    mockAxiosAdapter.reset();
    vi.clearAllMocks();
  });

  describe('checkAuthAction', () => {
    it('should dispatch "checkAuthAction.pending" and "checkAuthAction.fulfilled" when server returns 200', async () => {
      mockAxiosAdapter.onGet(APIRoute.Login).reply(200, mockUserData);

      await store.dispatch(checkAuthAction());

      const actions = extractActionsTypes(store.getActions());
      expect(actions).toEqual([
        checkAuthAction.pending.type,
        checkAuthAction.fulfilled.type,
      ]);
    });

    it('should dispatch "checkAuthAction.pending" and "checkAuthAction.rejected" when server returns 401', async () => {
      mockAxiosAdapter.onGet(APIRoute.Login).reply(401);

      await store.dispatch(checkAuthAction());

      const actions = extractActionsTypes(store.getActions());
      expect(actions).toEqual([
        checkAuthAction.pending.type,
        checkAuthAction.rejected.type,
      ]);
    });
  });

  describe('fetchOffersAction', () => {
    it('should dispatch "fetchOffersAction.pending" and "fetchOffersAction.fulfilled" with offers data', async () => {
      const mockOffers = [mockOffer, createMockOffer(), createMockOffer()];
      mockAxiosAdapter.onGet(APIRoute.Offers).reply(200, mockOffers);

      await store.dispatch(fetchOffersAction());

      const actionTypes = extractActionsTypes(store.getActions());
      expect(actionTypes).toEqual([
        fetchOffersAction.pending.type,
        fetchOffersAction.fulfilled.type,
      ]);

      const actions = store.getActions() as AnyAction[];
      expect(actions[1].payload).toEqual(mockOffers);
    });

    it('should dispatch "fetchOffersAction.pending" and "fetchOffersAction.rejected" when server returns error', async () => {
      mockAxiosAdapter.onGet(APIRoute.Offers).reply(500);

      await store.dispatch(fetchOffersAction());

      const actionTypes = extractActionsTypes(store.getActions());
      expect(actionTypes).toEqual([
        fetchOffersAction.pending.type,
        fetchOffersAction.rejected.type,
      ]);
    });
  });

  describe('loginAction', () => {
    const authData = { login: 'test@test.com', password: 'password123' };

    it('should dispatch loginAction.fulfilled and save token when login is successful', async () => {
      mockAxiosAdapter.onPost(APIRoute.Login).reply(200, mockUserData);
      mockAxiosAdapter.onGet(APIRoute.Favorite).reply(200, []);

      await store.dispatch(loginAction(authData));

      const actions = extractActionsTypes(store.getActions());
      expect(actions).toContain(loginAction.pending.type);
      expect(actions).toContain(loginAction.fulfilled.type);
      expect(saveToken).toHaveBeenCalledWith(mockUserData.token);
    });

    it('should dispatch loginAction.rejected when login fails', async () => {
      mockAxiosAdapter.onPost(APIRoute.Login).reply(401);

      await store.dispatch(loginAction(authData));

      const actions = extractActionsTypes(store.getActions());
      expect(actions).toEqual([
        loginAction.pending.type,
        loginAction.rejected.type,
      ]);
      expect(saveToken).not.toHaveBeenCalled();
    });
  });

  describe('logoutAction', () => {
    it('should dispatch logoutAction.fulfilled and drop token when logout is successful', async () => {
      mockAxiosAdapter.onDelete(APIRoute.Logout).reply(204);

      await store.dispatch(logoutAction());

      const actions = extractActionsTypes(store.getActions());
      expect(actions).toEqual([
        logoutAction.pending.type,
        logoutAction.fulfilled.type,
      ]);
      expect(dropToken).toHaveBeenCalled();
    });
  });

  describe('fetchCurrentOfferAction', () => {
    it('should dispatch fetchCurrentOfferAction.fulfilled with offer data', async () => {
      mockAxiosAdapter.onGet(`${APIRoute.Offers}/${mockOffer.id}`).reply(200, mockOffer);

      await store.dispatch(fetchCurrentOfferAction(mockOffer.id));

      const actions = extractActionsTypes(store.getActions());
      expect(actions).toEqual([
        fetchCurrentOfferAction.pending.type,
        fetchCurrentOfferAction.fulfilled.type,
      ]);

      const storeActions = store.getActions() as AnyAction[];
      expect(storeActions[1].payload).toEqual(mockOffer);
    });

    it('should dispatch fetchCurrentOfferAction.rejected when offer not found', async () => {
      const invalidId = 'invalid-id';
      mockAxiosAdapter.onGet(`${APIRoute.Offers}/${invalidId}`).reply(404);

      await store.dispatch(fetchCurrentOfferAction(invalidId));

      const actions = extractActionsTypes(store.getActions());
      expect(actions).toEqual([
        fetchCurrentOfferAction.pending.type,
        fetchCurrentOfferAction.rejected.type,
      ]);
    });
  });

  describe('fetchReviewsAction', () => {
    it('should dispatch fetchReviewsAction.fulfilled with reviews data', async () => {
      const mockReviews = [mockReview, createMockReview(), createMockReview()];
      mockAxiosAdapter.onGet(`${APIRoute.Comments}/${mockOffer.id}`).reply(200, mockReviews);

      await store.dispatch(fetchReviewsAction(mockOffer.id));

      const actions = extractActionsTypes(store.getActions());
      expect(actions).toEqual([
        fetchReviewsAction.pending.type,
        fetchReviewsAction.fulfilled.type,
      ]);

      const storeActions = store.getActions() as AnyAction[];
      expect(storeActions[1].payload).toEqual(mockReviews);
    });

    it('should dispatch fetchReviewsAction.rejected when request fails', async () => {
      mockAxiosAdapter.onGet(`${APIRoute.Comments}/${mockOffer.id}`).reply(500);

      await store.dispatch(fetchReviewsAction(mockOffer.id));

      const actions = extractActionsTypes(store.getActions());
      expect(actions).toEqual([
        fetchReviewsAction.pending.type,
        fetchReviewsAction.rejected.type,
      ]);
    });
  });

  describe('postReviewAction', () => {
    const reviewPost = { comment: 'Great place!', rating: 5 };

    it('should dispatch postReviewAction.fulfilled when review is posted successfully', async () => {
      const mockReviews = [mockReview, createMockReview()];
      mockAxiosAdapter.onPost(`${APIRoute.Comments}/${mockOffer.id}`).reply(201);
      mockAxiosAdapter.onGet(`${APIRoute.Comments}/${mockOffer.id}`).reply(200, mockReviews);

      await store.dispatch(postReviewAction({ offerId: mockOffer.id, review: reviewPost }));

      const actions = extractActionsTypes(store.getActions());
      expect(actions).toEqual([
        postReviewAction.pending.type,
        postReviewAction.fulfilled.type,
      ]);

      const storeActions = store.getActions() as AnyAction[];
      expect(storeActions[1].payload).toEqual(mockReviews);
    });

    it('should dispatch postReviewAction.rejected with error message when validation fails', async () => {
      mockAxiosAdapter.onPost(`${APIRoute.Comments}/${mockOffer.id}`).reply(400);

      const result = await store.dispatch(postReviewAction({ offerId: mockOffer.id, review: reviewPost }));

      const actions = extractActionsTypes(store.getActions());
      expect(actions).toEqual([
        postReviewAction.pending.type,
        postReviewAction.rejected.type,
      ]);
      expect(result.payload).toBe('Invalid review data');
    });

    it('should dispatch postReviewAction.rejected with error message when server error occurs', async () => {
      mockAxiosAdapter.onPost(`${APIRoute.Comments}/${mockOffer.id}`).reply(500);

      const result = await store.dispatch(postReviewAction({ offerId: mockOffer.id, review: reviewPost }));

      const actions = extractActionsTypes(store.getActions());
      expect(actions).toEqual([
        postReviewAction.pending.type,
        postReviewAction.rejected.type,
      ]);
      expect(result.payload).toBe('Failed to submit review');
    });
  });

  describe('fetchNearbyOffersAction', () => {
    it('should dispatch fetchNearbyOffersAction.fulfilled with nearby offers', async () => {
      const nearbyOffers = [createMockOffer(), createMockOffer(), createMockOffer()];
      mockAxiosAdapter.onGet(`${APIRoute.Offers}/${mockOffer.id}/nearby`).reply(200, nearbyOffers);

      await store.dispatch(fetchNearbyOffersAction(mockOffer.id));

      const actions = extractActionsTypes(store.getActions());
      expect(actions).toEqual([
        fetchNearbyOffersAction.pending.type,
        fetchNearbyOffersAction.fulfilled.type,
      ]);

      const storeActions = store.getActions() as AnyAction[];
      expect(storeActions[1].payload).toEqual(nearbyOffers);
    });
  });

  describe('changeFavoriteStatusAction', () => {
    it('should dispatch changeFavoriteStatusAction.fulfilled with updated offer', async () => {
      const updatedOffer = { ...mockOffer, isFavorite: true };
      mockAxiosAdapter.onPost(`${APIRoute.Favorite}/${mockOffer.id}/1`).reply(200, updatedOffer);

      await store.dispatch(changeFavoriteStatusAction({ offerId: mockOffer.id, status: 1 }));

      const actions = extractActionsTypes(store.getActions());
      expect(actions).toEqual([
        changeFavoriteStatusAction.pending.type,
        changeFavoriteStatusAction.fulfilled.type,
      ]);

      const storeActions = store.getActions() as AnyAction[];
      expect(storeActions[1].payload).toEqual(updatedOffer);
    });

    it('should dispatch changeFavoriteStatusAction.rejected when request fails', async () => {
      mockAxiosAdapter.onPost(`${APIRoute.Favorite}/${mockOffer.id}/1`).reply(500);

      await store.dispatch(changeFavoriteStatusAction({ offerId: mockOffer.id, status: 1 }));

      const actions = extractActionsTypes(store.getActions());
      expect(actions).toEqual([
        changeFavoriteStatusAction.pending.type,
        changeFavoriteStatusAction.rejected.type,
      ]);
    });
  });

  describe('toggleFavoriteAction', () => {
    it('should add to favorites when isFavorite is false', async () => {
      const updatedOffer = { ...mockOffer, isFavorite: true };
      mockAxiosAdapter.onPost(`${APIRoute.Favorite}/${mockOffer.id}/1`).reply(200, updatedOffer);

      await store.dispatch(toggleFavoriteAction({ offerId: mockOffer.id, isFavorite: false }));

      const actions = extractActionsTypes(store.getActions());
      expect(actions).toContain(toggleFavoriteAction.pending.type);
      expect(actions).toContain(toggleFavoriteAction.fulfilled.type);

      const storeActions = store.getActions() as AnyAction[];
      const updateOfferAction = storeActions.find((action) => action.type === updateOfferFavoriteStatus.type);
      expect(updateOfferAction).toBeTruthy();
      expect(updateOfferAction?.payload).toEqual({
        offerId: updatedOffer.id,
        isFavorite: updatedOffer.isFavorite,
      });

      const addToFavoriteAction = storeActions.find((action) => action.type === addToFavoriteOffers.type);
      expect(addToFavoriteAction).toBeTruthy();
      expect(addToFavoriteAction?.payload).toEqual(updatedOffer);
    });

    it('should remove from favorites when isFavorite is true', async () => {
      const updatedOffer = { ...mockOffer, isFavorite: false };
      mockAxiosAdapter.onPost(`${APIRoute.Favorite}/${mockOffer.id}/0`).reply(200, updatedOffer);

      await store.dispatch(toggleFavoriteAction({ offerId: mockOffer.id, isFavorite: true }));

      const actions = extractActionsTypes(store.getActions());
      expect(actions).toContain(toggleFavoriteAction.pending.type);
      expect(actions).toContain(toggleFavoriteAction.fulfilled.type);

      const storeActions = store.getActions() as AnyAction[];
      const updateOfferAction = storeActions.find((action) => action.type === updateOfferFavoriteStatus.type);
      expect(updateOfferAction).toBeTruthy();
      expect(updateOfferAction?.payload).toEqual({
        offerId: updatedOffer.id,
        isFavorite: updatedOffer.isFavorite,
      });

      const removeFromFavoriteAction = storeActions.find((action) => action.type === removeFromFavoriteOffers.type);
      expect(removeFromFavoriteAction).toBeTruthy();
      expect(removeFromFavoriteAction?.payload).toBe(mockOffer.id);
    });

    it('should handle API error correctly', async () => {
      mockAxiosAdapter.onPost(`${APIRoute.Favorite}/${mockOffer.id}/1`).reply(500);

      await store.dispatch(toggleFavoriteAction({ offerId: mockOffer.id, isFavorite: false }));

      const actions = extractActionsTypes(store.getActions());
      expect(actions).toContain(toggleFavoriteAction.pending.type);
      expect(actions).toContain(toggleFavoriteAction.rejected.type);

      const storeActions = store.getActions() as AnyAction[];
      const updateOfferAction = storeActions.find((action) => action.type === updateOfferFavoriteStatus.type);
      expect(updateOfferAction).toBeFalsy();
    });
  });

  describe('fetchFavoriteOffersAction', () => {
    it('should dispatch fetchFavoriteOffersAction.fulfilled with favorite offers', async () => {
      const favoriteOffers = [
        createMockOffer({ isFavorite: true }),
        createMockOffer({ isFavorite: true }),
        createMockOffer({ isFavorite: true })
      ];
      mockAxiosAdapter.onGet(APIRoute.Favorite).reply(200, favoriteOffers);

      await store.dispatch(fetchFavoriteOffersAction());

      const actions = extractActionsTypes(store.getActions());
      expect(actions).toEqual([
        fetchFavoriteOffersAction.pending.type,
        fetchFavoriteOffersAction.fulfilled.type,
      ]);

      const storeActions = store.getActions() as AnyAction[];
      expect(storeActions[1].payload).toEqual(favoriteOffers);
    });

    it('should dispatch fetchFavoriteOffersAction.rejected when request fails', async () => {
      mockAxiosAdapter.onGet(APIRoute.Favorite).reply(401);

      await store.dispatch(fetchFavoriteOffersAction());

      const actions = extractActionsTypes(store.getActions());
      expect(actions).toEqual([
        fetchFavoriteOffersAction.pending.type,
        fetchFavoriteOffersAction.rejected.type,
      ]);
    });
  });

  describe('Integration scenarios', () => {
    it('should handle complete user flow: login -> fetch favorites -> logout', async () => {
      const authData = { login: 'test@test.com', password: 'password123' };
      const favoriteOffers = [createMockOffer({ isFavorite: true })];

      mockAxiosAdapter.onPost(APIRoute.Login).reply(200, mockUserData);
      mockAxiosAdapter.onGet(APIRoute.Favorite).reply(200, favoriteOffers);

      await store.dispatch(loginAction(authData));

      expect(saveToken).toHaveBeenCalledWith(mockUserData.token);

      mockAxiosAdapter.onDelete(APIRoute.Logout).reply(204);

      await store.dispatch(logoutAction());

      expect(dropToken).toHaveBeenCalled();
    });

    it('should handle offer loading flow: fetch offers -> fetch current offer -> fetch nearby -> fetch reviews', async () => {
      const offers = [mockOffer, createMockOffer(), createMockOffer()];
      const nearbyOffers = [createMockOffer(), createMockOffer()];
      const reviews = [createMockReview(), createMockReview()];

      mockAxiosAdapter.onGet(APIRoute.Offers).reply(200, offers);
      mockAxiosAdapter.onGet(`${APIRoute.Offers}/${mockOffer.id}`).reply(200, mockOffer);
      mockAxiosAdapter.onGet(`${APIRoute.Offers}/${mockOffer.id}/nearby`).reply(200, nearbyOffers);
      mockAxiosAdapter.onGet(`${APIRoute.Comments}/${mockOffer.id}`).reply(200, reviews);

      await store.dispatch(fetchOffersAction());
      await store.dispatch(fetchCurrentOfferAction(mockOffer.id));
      await store.dispatch(fetchNearbyOffersAction(mockOffer.id));
      await store.dispatch(fetchReviewsAction(mockOffer.id));

      const actions = extractActionsTypes(store.getActions());
      expect(actions).toContain(fetchOffersAction.fulfilled.type);
      expect(actions).toContain(fetchCurrentOfferAction.fulfilled.type);
      expect(actions).toContain(fetchNearbyOffersAction.fulfilled.type);
      expect(actions).toContain(fetchReviewsAction.fulfilled.type);
    });
  });
});
