import { City } from './types/city';
export const CARD_VIEW: number = 5;
export const CARD_OTHER_VIEW: number = 3;

export const REVIEW_LIMIT = {
  MAX: 300,
  MIN: 50,
  REVIEWS_COUNT: 10,
} as const;

export const CARD_MODE = {
  VERTICAL: 'VERTICAL',
  HORIZONTAL: 'HORIZONTAL',
} as const;

export const MAP_TYPE = {
  MAINPAGE: 'cities__map',
  OFFERPAGE: 'offer__map',
} as const;

export const SORT_TYPE = {
  POPULAR: 'Popular',
  PRICE_LOW_TO_HIGH: 'Price: low to high',
  PRICE_HIGH_TO_LOW: 'Price: high to low',
  TOP_RATED: 'Top rated first',
} as const;
export type SortType = typeof SORT_TYPE[keyof typeof SORT_TYPE];

export const CITIES: City[] = [
  {
    name: 'Paris',
    location: {
      latitude: 48.8534,
      longitude: 2.3488,
      zoom: 13,
    }
  },
  {
    name: 'Cologne',
    location: {
      latitude: 50.9333,
      longitude: 6.95,
      zoom: 13,
    }
  },
  {
    name: 'Brussels',
    location: {
      latitude: 50.8504,
      longitude: 4.34878,
      zoom: 13,
    }
  },
  {
    name: 'Amsterdam',
    location: {
      latitude: 52.3909553943508,
      longitude: 4.85309666406198,
      zoom: 13,
    }
  },
  {
    name: 'Hamburg',
    location: {
      latitude: 53.5507,
      longitude: 9.9930,
      zoom: 13,
    }
  },
  {
    name: 'Dusseldorf',
    location: {
      latitude: 51.2217,
      longitude: 6.77616,
      zoom: 13,
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

export enum APIRoute {
  Offers = '/offers',
  OfferNearby = '/nearby',
  Favorite = '/favorite',
  Comments = '/comments',
  Login = '/login',
  Logout = '/logout',
}
export const REQUEST_TIMEOUT = 5000;
export const TIMEOUT_SHOW_ERROR = 2000;

export const HEADER_MODE = {
  AUTH: 'AUTH',
  NOAUTH: 'NOAUTH',
  LOGIN: 'LOGIN'
} as const;
