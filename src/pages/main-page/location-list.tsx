import { City } from '../../types/city';
import { CITIES } from '../../const';
import LocationItem from './location-item';
import { useAppDispatch, useAppSelector } from '../../store';
import { useEffect } from 'react';
import { fetchOffersAction } from '../../store/api-actions';
import { setCity } from '../../store/slice/app-data';
import { getCity } from '../../store/selectors';

function LocationList(): JSX.Element {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchOffersAction());
  }, [dispatch]);

  const currentCity = useAppSelector(getCity);

  const handleCityChange = (city: City) => {
    dispatch(setCity(city));
  };

  return (
    <div className="tabs">
      <section className="locations container">
        <ul className="locations__list tabs__list">
          {CITIES.map((city) => (
            <LocationItem
              key={city.name}
              city={city}
              isActive={city.name === currentCity.name}
              onClick={() => handleCityChange(city)}
            />
          ))}
        </ul>
      </section>
    </div>
  );
}

export default LocationList;
