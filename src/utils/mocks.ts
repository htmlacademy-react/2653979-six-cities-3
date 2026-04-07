import { Host } from '../types/host';
import { Offer } from '../types/offer';
import { Location } from '../types/location';
import { name, system, date, lorem } from 'faker';
import { CITIES } from '../const';
import { Review } from '../types/review';
import { UserData } from '../types/user-data';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { createAPI } from '../services/api';
import { State } from '../types/state';

const generateLatitude = (): number => Number((Math.random() * 180 - 90).toFixed(6));

const generateLongitude = (): number => Number((Math.random() * 360 - 180).toFixed(6));

export const generateRandomNumber = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

const generateRandomFloat = (min: number, max: number, fractionDigits: number = 1): number => {
  const value = Math.random() * (max - min) + min;
  return Number(value.toFixed(fractionDigits));
};

export const generateRandomBoolean = (): boolean => Math.random() > 0.5;


const createMockLocation = (): Location => ({
  latitude: generateLatitude(),
  longitude: generateLongitude(),
  zoom: generateRandomNumber(1, 20),
});

const createMockHost = (): Host => ({
  name: name.firstName(),
  avatarUrl: system.filePath(),
  isPro: generateRandomBoolean(),
});

export const createMockOffer = (overrides?: Partial<Offer>): Offer => {
  const mockLocation = createMockLocation();
  const mockHost = createMockHost();

  const offerTypes: Offer['type'][] = ['apartment', 'room', 'house', 'hotel'];
  const randomType = offerTypes[Math.floor(Math.random() * offerTypes.length)];

  const possibleGoods = ['WiFi', 'Parking', 'Pool', 'Kitchen', 'Air conditioning', 'Washer', 'Heating', 'TV'];
  const randomGoods = possibleGoods.filter(() => Math.random() > 0.5);

  return {
    id: crypto.randomUUID(),
    title: name.title(),
    type: randomType,
    price: overrides?.price ?? generateRandomNumber(50, 500),
    city: CITIES[generateRandomNumber(0, (CITIES.length - 1))],
    location: mockLocation,
    isFavorite: generateRandomBoolean(),
    isPremium: generateRandomBoolean(),
    rating: overrides?.rating ?? generateRandomFloat(1, 5, 1),
    description: 'mocktext',
    bedrooms: generateRandomNumber(1, 5),
    goods: randomGoods,
    previewImage: system.filePath(),
    images: Array.from({ length: 3 }, () => system.filePath()),
    maxAdults: generateRandomNumber(1, 6),
    host: mockHost,
  };
};

export const mockOffersForSorting = {
  differentPrices: [
    createMockOffer({ price: 50, id: '1' }),
    createMockOffer({ price: 200, id: '3' }),
    createMockOffer({ price: 300, id: '4' }),
    createMockOffer({ price: 100, id: '2' }),
    createMockOffer({ price: 500, id: '5' }),
  ],

  differentRatings: [
    createMockOffer({ rating: 1.5, id: '1' }),
    createMockOffer({ rating: 2.5, id: '2' }),
    createMockOffer({ rating: 4.5, id: '4' }),
    createMockOffer({ rating: 3.5, id: '3' }),
    createMockOffer({ rating: 5.0, id: '5' }),
  ],
  samePrices: [
    createMockOffer({ price: 100, id: '1' }),
    createMockOffer({ price: 100, id: '2' }),
    createMockOffer({ price: 100, id: '3' }),
  ],
  sameRatings: [
    createMockOffer({ rating: 4.0, id: '1' }),
    createMockOffer({ rating: 4.0, id: '2' }),
    createMockOffer({ rating: 4.0, id: '3' }),
  ],
};

export const createMockReview = (): Review => ({
  id: crypto.randomUUID(),
  date: date.past().toISOString(),
  user: {
    name: name.firstName(),
    avatarUrl: system.filePath(),
    isPro: generateRandomBoolean(),
  },
  comment: lorem.paragraph(),
  rating: generateRandomNumber(1, 5),
});

export const createMockUserData = (): UserData => ({
  name: name.firstName(),
  avatarUrl: system.fileName(),
  isPro: generateRandomBoolean(),
  email: 'test@gmail.com',
  token: 'test-token',
});

export type AppTunkDispatch = ThunkDispatch<State, ReturnType<typeof createAPI>, Action>;
export const extractActionsTypes = (actions: Action<string>[]) => actions.map(({ type }) => type);
