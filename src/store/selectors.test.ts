import { AuthorizationStatus, CITIES, NameSpace, SORT_TYPE } from '../const';
import {
  getAuthorizationStatus,
  getCity,
  getCurrentOffer,
  getIsCurrentOfferLoading,
  getIsNearbyLoading,
  getIsOffersDataLoading,
  getIsReviewsLoading,
  getNearbyOffers,
  getOffers,
  getReviews,
  getUserAvatar,
  getUserData,
  getUserEmail,
  getUserName,
  selectFavoriteOffers,
  selectOffersByCity,
  selectSortedOffers,
  selectOffersCount,
  selectFavoritesByCity,
  selectHasOffersInCurrentCity
} from './selectors';
import {
  createMockOffer,
  generateRandomNumber,
  generateRandomBoolean,
  createMockReview,
  mockOffersForSorting,
  createMockUserData
} from '../utils/mocks';

describe('Selectors', () => {
  describe('User selectors', () => {
    const userData = createMockUserData();

    const favoriteOffers = [createMockOffer(), createMockOffer()];

    const state = {
      [NameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Unknown,
        userData: userData,
        favoriteOffers: favoriteOffers,
      },
    };

    it('getAuthorizationStatus test', () => {
      const result = getAuthorizationStatus(state);
      expect(result).toBe(AuthorizationStatus.Unknown);
    });

    it('getUserData test', () => {
      const result = getUserData(state);
      expect(result).toBe(userData);
    });

    it('getUserEmail test', () => {
      const result = getUserEmail(state);
      expect(result).toBe(userData.email);
    });

    it('getUserName test', () => {
      const result = getUserName(state);
      expect(result).toBe(userData.name);
    });

    it('getUserAvatar test', () => {
      const result = getUserAvatar(state);
      expect(result).toBe(userData.avatarUrl);
    });

    it('selectFavoriteOffers test', () => {
      const result = selectFavoriteOffers(state);
      expect(result).toBe(favoriteOffers);
    });
  });

  describe('Data selectors - basic', () => {
    const mockCity = CITIES[generateRandomNumber(0, CITIES.length - 1)];
    const mockOffers = [createMockOffer(), createMockOffer()];
    const mockCurrentOffer = createMockOffer();
    const mockNearbyOffers = [createMockOffer()];
    const mockReviews = [createMockReview(), createMockReview()];
    const mockIsOffersDataLoading = generateRandomBoolean();
    const mockIsCurrentOfferLoading = generateRandomBoolean();
    const mockIsNearbyLoading = generateRandomBoolean();
    const mockIsReviewsLoading = generateRandomBoolean();

    const state = {
      [NameSpace.Data]: {
        city: mockCity,
        offers: mockOffers,
        isOffersDataLoading: mockIsOffersDataLoading,
        currentOffer: mockCurrentOffer,
        isCurrentOfferLoading: mockIsCurrentOfferLoading,
        nearbyOffers: mockNearbyOffers,
        isNearbyLoading: mockIsNearbyLoading,
        reviews: mockReviews,
        isReviewsLoading: mockIsReviewsLoading,
      },
    };

    it('getCity test', () => {
      const result = getCity(state);
      expect(result).toBe(mockCity);
    });

    it('getOffers test', () => {
      const result = getOffers(state);
      expect(result).toBe(mockOffers);
    });

    it('getCurrentOffer test', () => {
      const result = getCurrentOffer(state);
      expect(result).toBe(mockCurrentOffer);
    });

    it('getNearbyOffers test', () => {
      const result = getNearbyOffers(state);
      expect(result).toBe(mockNearbyOffers);
    });

    it('getReviews test', () => {
      const result = getReviews(state);
      expect(result).toBe(mockReviews);
    });

    it('getIsCurrentOfferLoading test', () => {
      const result = getIsCurrentOfferLoading(state);
      expect(result).toBe(mockIsCurrentOfferLoading);
    });

    it('getIsReviewsLoading test', () => {
      const result = getIsReviewsLoading(state);
      expect(result).toBe(mockIsReviewsLoading);
    });

    it('getIsNearbyLoading test', () => {
      const result = getIsNearbyLoading(state);
      expect(result).toBe(mockIsNearbyLoading);
    });

    it('getIsOffersDataLoading test', () => {
      const result = getIsOffersDataLoading(state);
      expect(result).toBe(mockIsOffersDataLoading);
    });
  });


  describe('Data selectors - selectOffersByCity', () => {
    const city1 = CITIES[0];
    const city2 = CITIES[1];

    const offerInCity1 = createMockOffer();
    offerInCity1.city = { ...offerInCity1.city, name: city1.name };

    const anotherOfferInCity1 = createMockOffer();
    anotherOfferInCity1.city = { ...anotherOfferInCity1.city, name: city1.name };

    const offerInCity2 = createMockOffer();
    offerInCity2.city = { ...offerInCity2.city, name: city2.name };

    const testState = {
      [NameSpace.Data]: {
        city: city1,
        offers: [offerInCity1, anotherOfferInCity1, offerInCity2],
        isOffersDataLoading: false,
        currentOffer: null,
        isCurrentOfferLoading: false,
        nearbyOffers: [],
        isNearbyLoading: false,
        reviews: [],
        isReviewsLoading: false,
      },
    };

    it('should return only offers from the current city', () => {
      const result = selectOffersByCity(testState);

      expect(result).toHaveLength(2);
      expect(result).toEqual([offerInCity1, anotherOfferInCity1]);

      result.forEach((offer) => {
        expect(offer.city.name).toBe(city1.name);
      });
    });

    it('should return empty array when no offers match current city', () => {
      const emptyState = {
        [NameSpace.Data]: {
          ...testState[NameSpace.Data],
          city: CITIES[2],
        },
      };

      const result = selectOffersByCity(emptyState);
      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });
  });

  describe('Data selectors - selectSortedOffers', () => {
    const city = CITIES[0];
    const priceOffers = mockOffersForSorting.differentPrices.map((offer) => ({
      ...offer,
      city: { ...offer.city, name: city.name }
    }));

    const ratingOffers = mockOffersForSorting.differentRatings.map((offer) => ({
      ...offer,
      city: { ...offer.city, name: city.name }
    }));

    const testPriceState = {
      [NameSpace.Data]: {
        city: city,
        offers: priceOffers,
        isOffersDataLoading: false,
        currentOffer: null,
        isCurrentOfferLoading: false,
        nearbyOffers: [],
        isNearbyLoading: false,
        reviews: [],
        isReviewsLoading: false,
      },
    };

    const testRatingState = {
      [NameSpace.Data]: {
        city: city,
        offers: ratingOffers,
        isOffersDataLoading: false,
        currentOffer: null,
        isCurrentOfferLoading: false,
        nearbyOffers: [],
        isNearbyLoading: false,
        reviews: [],
        isReviewsLoading: false,
      },
    };

    it('should sort offers by price low to high', () => {
      const result = selectSortedOffers(testPriceState, SORT_TYPE.PRICE_LOW_TO_HIGH);

      expect(result).toHaveLength(5);
      expect(result[0].price).toBe(priceOffers[0].price); // 50
      expect(result[1].price).toBe(priceOffers[3].price); // 100
      expect(result[2].price).toBe(priceOffers[1].price); // 200
      expect(result[3].price).toBe(priceOffers[2].price); // 300
      expect(result[4].price).toBe(priceOffers[4].price); // 500
    });

    it('should sort offers by price high to low', () => {
      const result = selectSortedOffers(testPriceState, SORT_TYPE.PRICE_HIGH_TO_LOW);

      expect(result[0].price).toBe(priceOffers[4].price); // 500
      expect(result[1].price).toBe(priceOffers[2].price); // 300
      expect(result[2].price).toBe(priceOffers[1].price); // 200
      expect(result[3].price).toBe(priceOffers[3].price); // 100
      expect(result[4].price).toBe(priceOffers[0].price); // 50
    });

    it('should sort offers by rating top rated first', () => {
      const result = selectSortedOffers(testRatingState, SORT_TYPE.TOP_RATED);

      expect(result).toHaveLength(5);
      expect(result[0].rating).toBe(ratingOffers[4].rating); // 5.0
      expect(result[1].rating).toBe(ratingOffers[2].rating); // 4.5
      expect(result[2].rating).toBe(ratingOffers[3].rating); // 3.5
      expect(result[3].rating).toBe(ratingOffers[1].rating); // 2.5
      expect(result[4].rating).toBe(ratingOffers[0].rating); // 1.5
    });

    it('should return empty array when no offers', () => {
      const emptyState = {
        [NameSpace.Data]: {
          ...testPriceState[NameSpace.Data],
          offers: [],
        },
      };

      const result = selectSortedOffers(emptyState, SORT_TYPE.PRICE_LOW_TO_HIGH);
      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });
  });

  describe('Data selectors - selectOffersCount', () => {
    const city = CITIES[0];

    const offer1 = createMockOffer();
    offer1.city = { ...offer1.city, name: city.name };

    const offer2 = createMockOffer();
    offer2.city = { ...offer2.city, name: city.name };

    const offerInOtherCity = createMockOffer();
    offerInOtherCity.city = { ...offerInOtherCity.city, name: CITIES[1].name };

    const testState = {
      [NameSpace.Data]: {
        city: city,
        offers: [offer1, offer2, offerInOtherCity],
        isOffersDataLoading: false,
        currentOffer: null,
        isCurrentOfferLoading: false,
        nearbyOffers: [],
        isNearbyLoading: false,
        reviews: [],
        isReviewsLoading: false,
      },
    };

    it('should return correct number of offers in current city', () => {
      const result = selectOffersCount(testState);
      expect(result).toBe(2);
    });

    it('should return 0 when no offers in current city', () => {
      const emptyState = {
        [NameSpace.Data]: {
          ...testState[NameSpace.Data],
          city: CITIES[2],
        },
      };

      const result = selectOffersCount(emptyState);
      expect(result).toBe(0);
    });

    it('should return 0 when there are no offers at all', () => {
      const emptyState = {
        [NameSpace.Data]: {
          ...testState[NameSpace.Data],
          offers: [],
        },
      };

      const result = selectOffersCount(emptyState);
      expect(result).toBe(0);
    });
  });

  describe('Data selectors - selectHasOffersInCurrentCity', () => {
    const city = CITIES[0];

    const offer = createMockOffer();
    offer.city = { ...offer.city, name: city.name };

    const testState = {
      [NameSpace.Data]: {
        city: city,
        offers: [offer],
        isOffersDataLoading: false,
        currentOffer: null,
        isCurrentOfferLoading: false,
        nearbyOffers: [],
        isNearbyLoading: false,
        reviews: [],
        isReviewsLoading: false,
      },
    };

    it('should return true when there are offers in current city', () => {
      const result = selectHasOffersInCurrentCity(testState);
      expect(result).toBe(true);
    });

    it('should return false when no offers in current city', () => {
      const emptyState = {
        [NameSpace.Data]: {
          ...testState[NameSpace.Data],
          city: CITIES[1],
          offers: [offer],
        },
      };

      const result = selectHasOffersInCurrentCity(emptyState);
      expect(result).toBe(false);
    });

    it('should return false when there are no offers at all', () => {
      const emptyState = {
        [NameSpace.Data]: {
          ...testState[NameSpace.Data],
          offers: [],
        },
      };

      const result = selectHasOffersInCurrentCity(emptyState);
      expect(result).toBe(false);
    });
  });

  describe('Data selectors - selectFavoritesByCity', () => {
    const cityParis = CITIES.find((c) => c.name === 'Paris') || CITIES[0];
    const cityCologne = CITIES.find((c) => c.name === 'Cologne') || CITIES[1];
    const cityBrussels = CITIES.find((c) => c.name === 'Brussels') || CITIES[2];

    const favoriteInParis1 = createMockOffer();
    favoriteInParis1.city = { ...favoriteInParis1.city, name: cityParis.name };
    favoriteInParis1.id = 'paris-1';

    const favoriteInParis2 = createMockOffer();
    favoriteInParis2.city = { ...favoriteInParis2.city, name: cityParis.name };
    favoriteInParis2.id = 'paris-2';

    const favoriteInCologne = createMockOffer();
    favoriteInCologne.city = { ...favoriteInCologne.city, name: cityCologne.name };
    favoriteInCologne.id = 'cologne-1';

    const testState = {
      [NameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
        userData: null,
        favoriteOffers: [favoriteInParis1, favoriteInParis2, favoriteInCologne],
      },
    };

    it('should group favorite offers by city', () => {
      const result = selectFavoritesByCity(testState);

      expect(Object.keys(result)).toHaveLength(2);
      expect(result[cityParis.name]).toBeDefined();
      expect(result[cityParis.name]).toHaveLength(2);
      expect(result[cityParis.name]).toEqual([favoriteInParis1, favoriteInParis2]);

      expect(result[cityCologne.name]).toBeDefined();
      expect(result[cityCologne.name]).toHaveLength(1);
      expect(result[cityCologne.name]).toEqual([favoriteInCologne]);

      expect(result[cityBrussels.name]).toBeUndefined();
    });

    it('should return empty object when no favorite offers', () => {
      const emptyState = {
        [NameSpace.User]: {
          ...testState[NameSpace.User],
          favoriteOffers: [],
        },
      };

      const result = selectFavoritesByCity(emptyState);
      expect(result).toEqual({});
    });

    it('should handle favorites from the same city correctly', () => {
      const sameCityState = {
        [NameSpace.User]: {
          ...testState[NameSpace.User],
          favoriteOffers: [favoriteInParis1, favoriteInParis2],
        },
      };

      const result = selectFavoritesByCity(sameCityState);

      expect(Object.keys(result)).toHaveLength(1);
      expect(result[cityParis.name]).toHaveLength(2);
      expect(result[cityParis.name]).toEqual([favoriteInParis1, favoriteInParis2]);
    });

    it('should preserve the order of offers', () => {
      const orderTestState = {
        [NameSpace.User]: {
          ...testState[NameSpace.User],
          favoriteOffers: [favoriteInCologne, favoriteInParis1, favoriteInParis2],
        },
      };

      const result = selectFavoritesByCity(orderTestState);

      expect(result[cityParis.name]).toEqual([favoriteInParis1, favoriteInParis2]);
      expect(result[cityCologne.name]).toEqual([favoriteInCologne]);
    });
  });
});

// describe('getError test' () => {

// });
