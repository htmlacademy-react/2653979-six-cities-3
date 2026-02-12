import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './components/app/app';
import { CART_VIEW, CITIES } from './const';

import { getRandomNumber } from './utils/utils';

const Settings = {
  CartView: CART_VIEW,
  OfferCount: getRandomNumber(1, 200),
  Cities: CITIES,
} as const;

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App
      cartView={Settings.CartView}
      offerCount={Settings.OfferCount}
      cities={Settings.Cities}
    />
  </React.StrictMode>
);
