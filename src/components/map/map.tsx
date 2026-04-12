import { City } from '../../types/city';
import { Offer } from '../../types/offer';
import leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useRef, useEffect } from 'react';
import pin from '../../../markup/img/pin.svg';
import pinActive from '../../../markup/img/pin-active.svg';
import { MAP_TYPE } from '../../const';

const defaultIcon = leaflet.icon({
  iconUrl: pin,
  iconSize: [27, 39],
  iconAnchor: [14, 39],
});

const currentIcon = leaflet.icon({
  iconUrl: pinActive,
  iconSize: [27, 39],
  iconAnchor: [14, 39],
});

type MapProps = {
  city: City;
  offers: Offer[];
  type: string;
  activeOffer: string | null;
  allowHover?: boolean;
}

function Map({ city, offers, type, activeOffer, allowHover = true }: MapProps): JSX.Element {
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
  }, []);

  useEffect(() => {
    const leafletMap = mapInstanceRef.current;

    if (!leafletMap) {
      return;
    }

    const markers: leaflet.Marker[] = offers.map((offer) => {
      let icon;
      if (type === MAP_TYPE.OFFERPAGE) {
        icon = offer.id === activeOffer ? currentIcon : defaultIcon;
      } else {
        icon = allowHover && offer.id === activeOffer ? currentIcon : defaultIcon;
      }

      return leaflet.marker(
        [offer.location.latitude, offer.location.longitude],
        { icon }
      ).addTo(leafletMap);
    });

    return () => {
      markers.forEach((marker) => marker.remove());
    };
  }, [offers, activeOffer, allowHover, type]);

  useEffect(() => {
    const leafletMap = mapInstanceRef.current;

    if (leafletMap) {
      leafletMap.setView(
        [city.location.latitude, city.location.longitude],
        city.location.zoom,
      );
    }
  }, [city]);

  return (
    <div className="cities__right-section">
      <section
        className={`${type} map`}
        style={{ height: '500px' }}
        ref={mapRef}
      >
      </section>
    </div>
  );
}

export default Map;
