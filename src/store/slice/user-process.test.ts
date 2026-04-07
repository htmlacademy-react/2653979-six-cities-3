import { AuthorizationStatus } from '../../const';
import { createMockOffer, createMockUserData } from '../../utils/mocks';
import {
  checkAuthAction,
  fetchFavoriteOffersAction,
  loginAction,
  logoutAction
} from '../api-actions';
import {
  addToFavoriteOffers,
  removeFromFavoriteOffers,
  updateFavoriteInUserSlice,
  userProcess
} from './user-process';

describe('User process test', () => {
  const initialState = {
    authorizationStatus: AuthorizationStatus.Unknown,
    userData: null,
    favoriteOffers: [],
  };

  describe('Reducers', () => {
    it('should return initial state with empty action', () => {
      const emptyAction = { type: '' };
      const result = userProcess.reducer(undefined, emptyAction);
      expect(result).toEqual(initialState);
    });

    it('should return default initial state with empty action', () => {
      const emptyAction = { type: '' };
      const expectedState = {
        authorizationStatus: AuthorizationStatus.Auth,
        userData: null,
        favoriteOffers: [createMockOffer()],
      };

      const result = userProcess.reducer(expectedState, emptyAction);
      expect(result).toEqual(expectedState);
    });

    describe('updateFavoriteInUserSlice', () => {
      it('should update isFavorite status of existing offer when isFavorite is true', () => {
        const mockOffer = createMockOffer();
        mockOffer.isFavorite = false;
        const state = {
          ...initialState,
          favoriteOffers: [mockOffer],
        };
        const action = updateFavoriteInUserSlice({
          offerId: mockOffer.id,
          isFavorite: true
        });

        const result = userProcess.reducer(state, action);

        expect(result.favoriteOffers[0].isFavorite).toBe(true);
      });

      it('should remove offer when isFavorite is false', () => {
        const mockOffer = createMockOffer();
        mockOffer.isFavorite = true;
        const state = {
          ...initialState,
          favoriteOffers: [mockOffer],
        };
        const action = updateFavoriteInUserSlice({
          offerId: mockOffer.id,
          isFavorite: false
        });

        const result = userProcess.reducer(state, action);

        expect(result.favoriteOffers).toHaveLength(0);
      });

      it('should not change state if offer not found when isFavorite is true', () => {
        const mockOffer = createMockOffer();
        const state = {
          ...initialState,
          favoriteOffers: [mockOffer],
        };
        const action = updateFavoriteInUserSlice({
          offerId: 'non-existent-id',
          isFavorite: true
        });

        const result = userProcess.reducer(state, action);

        expect(result.favoriteOffers).toEqual(state.favoriteOffers);
      });
    });

    describe('addToFavoriteOffers', () => {
      it('should add new offer to favoriteOffers', () => {
        const mockOffer = createMockOffer();
        const action = addToFavoriteOffers(mockOffer);

        const result = userProcess.reducer(initialState, action);

        expect(result.favoriteOffers).toHaveLength(1);
        expect(result.favoriteOffers[0]).toEqual(mockOffer);
      });

      it('should not add duplicate offer', () => {
        const mockOffer = createMockOffer();
        const state = {
          ...initialState,
          favoriteOffers: [mockOffer],
        };
        const action = addToFavoriteOffers(mockOffer);

        const result = userProcess.reducer(state, action);

        expect(result.favoriteOffers).toHaveLength(1);
        expect(result.favoriteOffers[0]).toEqual(mockOffer);
      });

      it('should update existing offer if already present', () => {
        const mockOffer = createMockOffer();
        const updatedOffer = { ...mockOffer, isFavorite: true };
        const state = {
          ...initialState,
          favoriteOffers: [mockOffer],
        };
        const action = addToFavoriteOffers(updatedOffer);

        const result = userProcess.reducer(state, action);

        expect(result.favoriteOffers).toHaveLength(1);
        expect(result.favoriteOffers[0].isFavorite).toBe(true);
      });
    });

    describe('removeFromFavoriteOffers', () => {
      it('should remove offer by id', () => {
        const mockOffer1 = createMockOffer();
        const mockOffer2 = createMockOffer();
        const state = {
          ...initialState,
          favoriteOffers: [mockOffer1, mockOffer2],
        };
        const action = removeFromFavoriteOffers(mockOffer1.id);

        const result = userProcess.reducer(state, action);

        expect(result.favoriteOffers).toHaveLength(1);
        expect(result.favoriteOffers[0]).toEqual(mockOffer2);
      });

      it('should not change state if offer not found', () => {
        const mockOffer = createMockOffer();
        const state = {
          ...initialState,
          favoriteOffers: [mockOffer],
        };
        const action = removeFromFavoriteOffers('non-existent-id');

        const result = userProcess.reducer(state, action);

        expect(result.favoriteOffers).toEqual(state.favoriteOffers);
      });

      it('should handle empty favoriteOffers array', () => {
        const action = removeFromFavoriteOffers('any-id');

        const result = userProcess.reducer(initialState, action);

        expect(result.favoriteOffers).toHaveLength(0);
      });
    });
  });

  describe('ExtraReducers', () => {
    describe('checkAuthAction', () => {
      it('should set auth status and user data on fulfilled', () => {
        const mockUserData = createMockUserData();
        const action = checkAuthAction.fulfilled(mockUserData, '', undefined);

        const result = userProcess.reducer(initialState, action);

        expect(result.authorizationStatus).toBe(AuthorizationStatus.Auth);
        expect(result.userData).toEqual(mockUserData);
      });

      it('should set no auth status and clear data on rejected', () => {
        const stateWithAuth = {
          authorizationStatus: AuthorizationStatus.Auth,
          userData: createMockUserData(),
          favoriteOffers: [createMockOffer()],
        };
        const action = checkAuthAction.rejected(null, '', undefined);

        const result = userProcess.reducer(stateWithAuth, action);

        expect(result.authorizationStatus).toBe(AuthorizationStatus.NoAuth);
        expect(result.userData).toBeNull();
        expect(result.favoriteOffers).toHaveLength(0);
      });
    });

    describe('loginAction', () => {
      it('should set auth status and user data on fulfilled', () => {
        const mockUserData = createMockUserData();
        const action = loginAction.fulfilled(mockUserData, '', { login: 'test@test.com', password: '123456' });

        const result = userProcess.reducer(initialState, action);

        expect(result.authorizationStatus).toBe(AuthorizationStatus.Auth);
        expect(result.userData).toEqual(mockUserData);
      });

      it('should set no auth status and clear data on rejected', () => {
        const stateWithAuth = {
          authorizationStatus: AuthorizationStatus.Auth,
          userData: createMockUserData(),
          favoriteOffers: [createMockOffer()],
        };
        const action = loginAction.rejected(null, '', { login: 'test@test.com', password: '123456' });

        const result = userProcess.reducer(stateWithAuth, action);

        expect(result.authorizationStatus).toBe(AuthorizationStatus.NoAuth);
        expect(result.userData).toBeNull();
        expect(result.favoriteOffers).toHaveLength(0);
      });
    });

    describe('logoutAction', () => {
      it('should set no auth status and clear data on fulfilled', () => {
        const stateWithAuth = {
          authorizationStatus: AuthorizationStatus.Auth,
          userData: createMockUserData(),
          favoriteOffers: [createMockOffer()],
        };
        const action = logoutAction.fulfilled(undefined, '', undefined);

        const result = userProcess.reducer(stateWithAuth, action);

        expect(result.authorizationStatus).toBe(AuthorizationStatus.NoAuth);
        expect(result.userData).toBeNull();
        expect(result.favoriteOffers).toHaveLength(0);
      });
    });

    describe('fetchFavoriteOffersAction', () => {
      it('should set favoriteOffers on fulfilled', () => {
        const mockOffers = [createMockOffer(), createMockOffer()];
        const action = fetchFavoriteOffersAction.fulfilled(mockOffers, '', undefined);

        const result = userProcess.reducer(initialState, action);

        expect(result.favoriteOffers).toEqual(mockOffers);
      });

      it('should clear favoriteOffers on rejected', () => {
        const stateWithOffers = {
          ...initialState,
          favoriteOffers: [createMockOffer(), createMockOffer()],
        };
        const action = fetchFavoriteOffersAction.rejected(null, '', undefined);

        const result = userProcess.reducer(stateWithOffers, action);

        expect(result.favoriteOffers).toHaveLength(0);
      });
    });
  });
});
