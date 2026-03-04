import { City } from './types/city';
export const CARD_VIEW: number = 5;
export const CARD_OTHER_VIEW: number = 3;

export const REVIEW_LIMIT = {
  MAX: 300,
  MIN: 50,
} as const;

export const CITIES: City[] = [
  {
    name: 'Paris',
    location: {
      latitude: 52.35514938496378,
      longitude: 4.673877537499948,
      zoom: 8,
    }
  },
  {
    name: 'Cologne',
    location: {
      latitude: 56.35514938496378,
      longitude: 2.673877537499948,
      zoom: 7,
    }
  },
  {
    name: 'Brussels',
    location: {
      latitude: 56.35514457996378,
      longitude: 2.673877537499948,
      zoom: 8,
    }
  },
  {
    name: 'Amsterdam',
    location: {
      latitude: 45.35514457996378,
      longitude: 2.673877537499948,
      zoom: 8,
    }
  },
  {
    name: 'Hamburg',
    location: {
      latitude: 45.35514457996378,
      longitude: 2.673877537499948,
      zoom: 8,
    }
  },
  {
    name: 'Dusseldorf',
    location: {
      latitude: 35.35514457996378,
      longitude: 2.673877537499948,
      zoom: 8,
    }
  },
];

export enum APP_ROUTE {
  Login = '/login',
  Favorites = '/favorites',
  Offer = '/offer/:id',
  Root = '/',
}

export enum AuthorizationStatus {
  Auth = 'AUTH',
  NoAuth = 'NO_AUTH',
  Unknown = 'UNKNOWN',
}
