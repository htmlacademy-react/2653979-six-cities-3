import { createAction } from '@reduxjs/toolkit';
import { City } from '../types/city';
import { Offer } from '../types/offer';

export const selectCity = createAction<City>('selectCity');
export const fillOfferList = createAction<Offer[]>('fillOfferList');
