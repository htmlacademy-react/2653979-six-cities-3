import { createReducer } from '@reduxjs/toolkit';
import { CITIES } from '../const';
import { mockOffer } from '../mock/mock-offer';
import { selectCity, fillOfferList } from './action';
import { City } from '../types/city';
import { Offer } from '../types/offer';

type State = {
  city: City;
  offers: Offer[];
}

const initialState: State = {
  city: CITIES[0],
  offers: mockOffer,
};

const reducer = createReducer(initialState, (builder) => {
  builder.addCase(selectCity, (state, action) => {
    state.city = action.payload;
  })
    .addCase(fillOfferList, (state, action) => {
      state.offers = action.payload;
    });
});

export { reducer };
