import { City } from '../../types/city';
import { CITIES } from '../../const';
import LocationItem from './location-item';

type LocationListProps = {
  currentCity: City;
  onCityChange: (city: City) => void;
}

function LocationList({ currentCity, onCityChange }: LocationListProps): JSX.Element {
  return (
    <div className="tabs">
      <section className="locations container">
        <ul className="locations__list tabs__list">
          {CITIES.map((city) => (
            <LocationItem
              key={city.name}
              city={city}
              isActive={city.name === currentCity.name}
              onClick={() => onCityChange(city)}
            />
          ))}
        </ul>
      </section>
    </div>
  );
}

export default LocationList;
