import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

import Header from '../../components/header/header';
import Map from '../../components/map/map';
import OfferList from '../../components/offer-list/offer-list';
import LocationList from './location-list';
import Sort from './sort';
import { City } from '../../types/city';
import { MAP_TYPE, SORT_TYPE, SortType } from '../../const';
import { useAppDispatch, useAppSelector } from '../../store'; // обновленный импорт
import { setCity } from '../../store/action';
import {
  setCity as selectCurrentCity,
  selectSortedOffers,
  selectOffersCount
} from '../../store/selectors';

type MainPageProps = {
  cardView: number;
}

function MainPage({ cardView }: MainPageProps): JSX.Element {
  const dispatch = useAppDispatch();
  const [currentSort, setCurrentSort] = useState<SortType>(SORT_TYPE.POPULAR);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  const currentCity = useAppSelector(selectCurrentCity);
  const offers = useAppSelector((state) => selectSortedOffers(state, currentSort));
  const offersCount = useAppSelector(selectOffersCount);

  const handleActiveCardToggle = (cardId: string | null) => {
    setActiveCardId(cardId);
  };

  const handleCityChange = (city: City) => {
    dispatch(setCity(city));
  };

  const handleSortChange = (sortType: SortType) => {
    setCurrentSort(sortType);
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
        <div className="cities">
          <div className="cities__places-container container">
            <section className="cities__places places">
              <h2 className="visually-hidden">Places</h2>
              <b className="places__found">{offersCount} places to stay in {currentCity.name}</b>
              <Sort
                currentSort={currentSort}
                onSortChange={handleSortChange}
              />
              <OfferList
                cardView={cardView}
                offers={offers}
                onActiveCardToggle={handleActiveCardToggle}
              />
            </section>
            <Map
              city={currentCity}
              offers={offers}
              type={MAP_TYPE.MAINPAGE}
              activeOffer={activeCardId}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default MainPage;
