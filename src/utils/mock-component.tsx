import { configureMockStore, MockStore } from '@jedmao/redux-mock-store';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';
import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';
import axios, { AxiosInstance } from 'axios';
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
import { AppTunkDispatch } from './mocks';
import { State } from '../types/state';
import { Action } from 'redux';
import { Provider } from 'react-redux';

export function withHistory(component: JSX.Element, initialEntries?: string[]) {
  return (
    <MemoryRouter initialEntries={initialEntries || ['/']}>
      <HelmetProvider>
        {component}
      </HelmetProvider>
    </MemoryRouter>
  );
}

type ComponentWithMockStore = {
  withStoreComponent: JSX.Element;
  mockStore: MockStore;
  mockAxiosAdapter: MockAdapter;
}

export function withStore(
  component: JSX.Element,
  initialState: Partial<State> = {},
): ComponentWithMockStore {
  const api = createAPI();
  const mockAxiosAdapter = new MockAdapter(api);
  const middleware = [thunk.withExtraArgument(api)];
  const mockStoreCreator = configureMockStore<State, Action<string>, AppTunkDispatch>(middleware);
  const mockStore = mockStoreCreator(initialState);

  return {
    withStoreComponent: <Provider store={mockStore}>{component}</Provider>,
    mockStore,
    mockAxiosAdapter,
  };
}
