import { Offer } from '../types/offer';

export const mockOffer: Offer[] = [
  {
    id: crypto.randomUUID(),
    title: 'Title1',
    type: 'hotel',
    price: 12,
    city: {
      name: 'Paris',
      location: {
        latitude: 52.35514938496378,
        longitude: 4.673877537499948,
        zoom: 8,
      }
    },
    location: {
      latitude: 52.35514938496378,
      longitude: 4.673877537499948,
      zoom: 8,
    },
    isFavorite: true,
    isPremium: true,
    rating: 4,
    previewImage: 'https://url-to-image/image.png',
  },
  {
    id: crypto.randomUUID(),
    title: 'Title2',
    type: 'apartment',
    price: 22,
    city: {
      name: 'Cologne',
      location: {
        latitude: 56.35514938496378,
        longitude: 2.673877537499948,
        zoom: 7,
      }
    },
    location: {
      latitude: 56.35514938496378,
      longitude: 2.673877537499948,
      zoom: 7,
    },
    isFavorite: true,
    isPremium: false,
    rating: 4.5,
    previewImage: 'https://url-to-image/image.png',
  },
  {
    id: crypto.randomUUID(),
    title: 'Title3',
    type: 'house',
    price: 32,
    city: {
      name: 'Brussels',
      location: {
        latitude: 56.35514457996378,
        longitude: 2.673877537499948,
        zoom: 8,
      }
    },
    location: {
      latitude: 56.35514457996378,
      longitude: 2.673877537499948,
      zoom: 8,
    },
    isFavorite: false,
    isPremium: true,
    rating: 5,
    previewImage: 'https://url-to-image/image.png',
  },
  {
    id: crypto.randomUUID(),
    title: 'Title4',
    type: 'house',
    price: 32,
    city: {
      name: 'Amsterdam',
      location: {
        latitude: 45.35514457996378,
        longitude: 2.673877537499948,
        zoom: 8,
      }
    },
    location: {
      latitude: 45.35514457996378,
      longitude: 2.673877537499948,
      zoom: 8,
    },
    isFavorite: false,
    isPremium: true,
    rating: 2.4,
    previewImage: 'https://url-to-image/image.png',
  },
  {
    id: crypto.randomUUID(),
    title: 'Title5',
    type: 'room',
    price: 42,
    city: {
      name: 'Hamburg',
      location: {
        latitude: 45.35514457996378,
        longitude: 2.673877537499948,
        zoom: 8,
      }
    },
    location: {
      latitude: 45.35514457996378,
      longitude: 2.673877537499948,
      zoom: 8,
    },
    isFavorite: false,
    isPremium: true,
    rating: 3.4,
    previewImage: 'https://url-to-image/image.png',
  },
  {
    id: crypto.randomUUID(),
    title: 'Title6',
    type: 'apartment',
    price: 52,
    city: {
      name: 'Dusseldorf',
      location: {
        latitude: 35.35514457996378,
        longitude: 2.673877537499948,
        zoom: 8,
      }
    },
    location: {
      latitude: 35.35514457996378,
      longitude: 2.673877537499948,
      zoom: 8,
    },
    isFavorite: true,
    isPremium: true,
    rating: 4.8,
    previewImage: 'https://url-to-image/image.png',
  },
];
