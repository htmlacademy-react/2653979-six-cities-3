import { configureStore } from '@reduxjs/toolkit';
import { reducer } from './reducer';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../types/state';
import { State } from '../types/state';
import { TypedUseSelectorHook } from 'react-redux';

export const store = configureStore({reducer});

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<State> = useSelector;
