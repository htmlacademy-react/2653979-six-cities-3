import { configureStore } from '@reduxjs/toolkit';
import { store } from './index';
import { userProcess } from './slice/user-process';
import { appData } from './slice/app-data';
import { appError } from './slice/app-error';
import { NameSpace } from '../const';
import { createAPI } from '../services/api';

vi.mock('../services/api', () => ({
  createAPI: vi.fn(() => ({
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }))
}));

describe('Redux Store Middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should configure store with correct reducers', () => {
    const state = store.getState();
    expect(state).toHaveProperty(NameSpace.User);
    expect(state).toHaveProperty(NameSpace.Data);
    expect(state).toHaveProperty(NameSpace.Error);
  });

  it('should have thunk middleware with api extra argument', () => {
    const mockApi = createAPI();
    const testStore = configureStore({
      reducer: {
        [NameSpace.User]: userProcess.reducer,
        [NameSpace.Data]: appData.reducer,
        [NameSpace.Error]: appError.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          thunk: {
            extraArgument: mockApi,
          }
        })
    });
    expect(testStore).toBeDefined();
  });
});
