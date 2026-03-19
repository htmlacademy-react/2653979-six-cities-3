import { createAction } from '@reduxjs/toolkit';
import { City } from '../types/city';
import { Offer } from '../types/offer';

export const setCity = createAction<City>('selectCity');
export const setOfferList = createAction<Offer[]>('fillOfferList');
