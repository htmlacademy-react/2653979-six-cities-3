import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { createAPI } from '../services/api';
import { userProcess } from './slice/user-process';
import { appData } from './slice/app-data';
import { appError } from './slice/app-error';
import { NameSpace } from '../const';

const api = createAPI();

export const store = configureStore({
  reducer: {
    [NameSpace.User]: userProcess.reducer,
    [NameSpace.Data]: appData.reducer,
    [NameSpace.Error]: appError.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: api,
      }
    })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
