import { render, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import Map from './map';
import { CITIES, MAP_TYPE } from '../../const';
import { createMockOffer } from '../../utils/mocks';

const addToMock = vi.fn();
const removeMock = vi.fn();

const { markerMock } = vi.hoisted(() => ({
  markerMock: vi.fn(),
}));
interface MapMock {
  setView: (center: [number, number], zoom: number) => MapMock;
}

vi.mock('leaflet', () => {
  const markerImpl = markerMock.mockImplementation(() => ({
    addTo: vi.fn(() => ({ remove: removeMock })),
  }));

  const mapMock: MapMock = {
    setView() {
      return this;
    },
  };

  return {
    __esModule: true,
    default: {
      map: vi.fn(() => mapMock),
      tileLayer: vi.fn(() => ({ addTo: addToMock })),
      marker: markerImpl,
      icon: vi.fn(),
    },
  };
});

describe('Component: Map', () => {
  const city = CITIES[0];

  const offers = [
    createMockOffer({ id: '1' }),
    createMockOffer({ id: '2' }),
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly', () => {
    const { container } = render(
      <Map
        city={city}
        offers={offers}
        type="cities"
        activeOffer={null}
      />
    );

    expect(container.querySelector('.map')).toBeInTheDocument();
  });

  it('should create markers for offers', async () => {
    render(
      <Map city={city} offers={offers} type="cities" activeOffer={null} />
    );

    await waitFor(() => {
      expect(markerMock).toHaveBeenCalledTimes(offers.length);
    });
  });

  it('should update markers when offers change', async () => {
    const { rerender } = render(
      <Map city={city} offers={offers} type="cities" activeOffer={null} />
    );

    const newOffers = [createMockOffer({ id: '3' })];

    rerender(
      <Map city={city} offers={newOffers} type="cities" activeOffer={null} />
    );

    await waitFor(() => {
      expect(markerMock).toHaveBeenCalled();
    });
  });


  it('should handle activeOffer logic', async () => {
    render(
      <Map
        city={city}
        offers={offers}
        type="cities"
        activeOffer={offers[0].id}
      />
    );

    await waitFor(() => {
      expect(markerMock).toHaveBeenCalled();
    });
  });

  it('should use OFFERPAGE logic', async () => {
    render(
      <Map
        city={city}
        offers={offers}
        type={MAP_TYPE.OFFERPAGE}
        activeOffer={null}
      />
    );

    await waitFor(() => {
      expect(markerMock).toHaveBeenCalledTimes(offers.length);
    });
  });
});
