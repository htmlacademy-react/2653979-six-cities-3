import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

import Header from '../../components/header/header';
import LocationList from './location-list';
import { City } from '../../types/city';
import { useAppDispatch, useAppSelector } from '../../store';
import { setCity } from '../../store/action';
import { setCity as selectCurrentCity } from '../../store/selectors';
import { fetchOffersAction } from '../../store/api-actions';
import CardsMap from '../../components/cities/cards-map';

function MainPage(): JSX.Element {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchOffersAction());
  }, [dispatch]);

  const currentCity = useAppSelector(selectCurrentCity);

  const handleCityChange = (city: City) => {
    dispatch(setCity(city));
  };

  return (
    <div className="page page--gray page--main">
      <Helmet>
        <title>6 Cities</title>
      </Helmet>
      <Header />
      <main className="page__main page__main--index">
        <h1 className="visually-hidden">Cities</h1>
        <LocationList
          currentCity={currentCity}
          onCityChange={handleCityChange}
        />
        <CardsMap/>
      </main>
    </div>
  );
}

export default MainPage;
