import { City } from '../../types/city';
import { Offer } from '../../types/offer';
import leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useRef, useEffect } from 'react';

type MapProps = {
  city: City;
  offers: Offer[];
  type: string;
}

function Map({ city, offers, type }: MapProps): JSX.Element {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);


  useEffect(() => {
    if (mapRef.current !== null && mapInstanceRef.current === null) {
      const map = leaflet.map(mapRef.current).setView(
        [city.location.latitude, city.location.longitude],
        city.location.zoom,
      );

      leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      mapInstanceRef.current = map;
    }
  }, [city]);


  useEffect(() => {
    if (!mapInstanceRef.current) {
      return;
    }

    const map = mapInstanceRef.current;

    const markers = offers.map((offer) =>
      leaflet.marker([offer.location.latitude, offer.location.longitude]).addTo(map),
    );

    return () => {
      markers.forEach((marker) => marker.remove());
    };
  }, [offers]);

  return (
    <div className="cities__right-section">
      <section
        className={`${type } map`}
        style={{ height: '500px' }}
        ref={mapRef}
      >
      </section>
    </div>
  );
}

export default Map;
