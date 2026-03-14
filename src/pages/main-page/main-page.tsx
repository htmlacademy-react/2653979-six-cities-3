import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

import Header from '../../components/header/header';
import Map from '../../components/map/map';
import OfferList from '../../components/offer-list/offer-list';
import LocationList from './location-list';
import Sort from './sort';
import { City } from '../../types/city';
import { MAP_TYPE, SORT_TYPE, SortType } from '../../const';
import { useAppDispatch, useAppSelector } from '../../store';
import { selectCity } from '../../store/action';
import { sortOffers } from '../../utils/utils';

type MainPageProps = {
  cardView: number;
}

function MainPage({ cardView }: MainPageProps): JSX.Element {
  const dispatch = useAppDispatch();
  const [currentSort, setCurrentSort] = useState<SortType>(SORT_TYPE.POPULAR);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const currentCity = useAppSelector((state) => state.city);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const allOffers = useAppSelector((state) => state.offers);

  const filteredOffers = allOffers.filter((offer) => offer.city.name === currentCity.name);

  const offers = sortOffers(filteredOffers, currentSort);

  const handleCardHover = (cardId: string) => {
    setActiveCardId(cardId);
  };

  const handleCardLeave = () => {
    setActiveCardId(null);
  };

  const handleCityChange = (city: City) => {
    dispatch(selectCity(city));
  };

  const handleSortChange = (sortType: SortType) => {
    setCurrentSort(sortType);
    setIsSortOpen(false);
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
              <b className="places__found">{offers.length} places to stay in {currentCity.name}</b>
              <form className="places__sorting" action="#" method="get">
                <span className="places__sorting-caption">Sort by</span>
                <span
                  className="places__sorting-type"
                  tabIndex={0}
                  onClick={() => setIsSortOpen(!isSortOpen)}
                >
                  {currentSort}
                  <svg className="places__sorting-arrow" width="7" height="4">
                    <use xlinkHref="#icon-arrow-select"></use>
                  </svg>
                </span>

                <Sort
                  currentSort={currentSort}
                  onSortChange={handleSortChange}
                  isOpen={isSortOpen}
                />
              </form>
              <OfferList
                cardView={cardView}
                offers={offers}
                onMouseEnter={handleCardHover}
                onMouseLeave={handleCardLeave}
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
