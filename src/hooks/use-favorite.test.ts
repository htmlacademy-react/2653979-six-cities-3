import { renderHook, act } from '@testing-library/react';
import { getAuthorizationStatus } from '../store/selectors';
import { APP_ROUTE, AuthorizationStatus } from '../const';
import * as router from 'react-router-dom';
import { vi } from 'vitest';
import { useFavorite } from './use-favorite';
import * as store from '../store';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('hook: useFavorite', () => {
  const mockDispatch = vi.fn();
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(router.useNavigate).mockReturnValue(mockNavigate);
    vi.spyOn(store, 'useAppDispatch').mockReturnValue(mockDispatch);
  });

  it('should return isAuth = true when user is authorized', () => {
    vi.spyOn(store, 'useAppSelector').mockImplementation((selector) =>
      selector === getAuthorizationStatus ? AuthorizationStatus.Auth : undefined
    );

    const { result } = renderHook(() => useFavorite());
    expect(result.current.isAuth).toBe(true);
  });

  it('should return isAuth = false when user is not authorized', () => {
    vi.spyOn(store, 'useAppSelector').mockImplementation((selector) =>
      selector === getAuthorizationStatus ? AuthorizationStatus.NoAuth : undefined
    );

    const { result } = renderHook(() => useFavorite());
    expect(result.current.isAuth).toBe(false);
  });

  it('should navigate to login if user is not authorized', async () => {
    vi.spyOn(store, 'useAppSelector').mockImplementation((selector) =>
      selector === getAuthorizationStatus ? AuthorizationStatus.NoAuth : undefined
    );

    const { result } = renderHook(() => useFavorite());

    await act(async () => {
      await result.current.toggleFavorite('1', true);
    });

    expect(mockNavigate).toHaveBeenCalledWith(APP_ROUTE.Login);
    expect(mockDispatch).not.toHaveBeenCalled();
  });
});
