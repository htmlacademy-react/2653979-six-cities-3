import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './components/app/app';
import { CARD_VIEW } from './const';

import { mockOffer } from './mock/mock-offer';
import { MockReviews } from './mock/mock-reviews';

const Settings = {
  CardView: CARD_VIEW,
} as const;

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App
      cardView={Settings.CardView}
      offers={mockOffer}
      reviews={MockReviews}
    />
  </React.StrictMode>
);
