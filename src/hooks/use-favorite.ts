import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { toggleFavoriteAction } from '../store/api-actions';
import { getAuthorizationStatus } from '../store/selectors';
import { APP_ROUTE, AuthorizationStatus } from '../const';

type UseFavoriteResult = {
  toggleFavorite: (offerId: string, isFavorite: boolean) => Promise<void>;
  isAuth: boolean;
};

export function useFavorite(): UseFavoriteResult {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const authorizationStatus = useAppSelector(getAuthorizationStatus);
  const isAuth = authorizationStatus === AuthorizationStatus.Auth;

  const toggleFavorite = async (offerId: string, isFavorite: boolean) => {
    if (!isAuth) {
      navigate(APP_ROUTE.Login);
      return;
    }

    await dispatch(toggleFavoriteAction({
      offerId,
      isFavorite
    })).unwrap();
  };

  return {
    toggleFavorite,
    isAuth
  };
}
