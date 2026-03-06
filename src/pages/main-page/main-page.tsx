import { Helmet } from 'react-helmet-async';

import Header from '../../components/header/header';
import Map from '../../components/map/map';
import OfferList from '../../components/offer-list/offer-list';
import { Offer } from '../../types/offer';
import { City } from '../../types/city';

import { useState } from 'react';

type MainPageProps = {
  cardView: number;
  offerCount: number;
  cities: City[];
  offers: Offer[];
}

function MainPage({ cardView, offerCount, cities, offers }: MainPageProps): JSX.Element {
  const currentCity = cities[3];
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const handleCardHover = (cardId: string) => {
    setActiveCardId(cardId);

    // eslint-disable-next-line no-console
    console.log(activeCardId);

  };
  const handleCardLeave = () => {
    setActiveCardId(null);
  };

  return (
    <div className="page page--gray page--main">
      <Helmet>
        <title>6 Cities</title>
      </Helmet>
      <Header />
      <main className="page__main page__main--index">
        <h1 className="visually-hidden">Cities</h1>
        <div className="tabs">
          <section className="locations container">
            <ul className="locations__list tabs__list">
              {cities.map((city, index) =>
                city && (
                  <li className="locations__item" key={city.name}>
                    <a className={`locations__item-link tabs__item ${index === 0 ? 'tabs__item--active' : ''}`} href="#">
                      <span>{city.name}</span>
                    </a>
                  </li>
                )
              )}
            </ul>
          </section>
        </div>
        <div className="cities">
          <div className="cities__places-container container">
            <section className="cities__places places">
              <h2 className="visually-hidden">Places</h2>
              <b className="places__found">{offerCount} places to stay in {currentCity.name}</b>
              <form className="places__sorting" action="#" method="get">
                <span className="places__sorting-caption">Sort by</span>
                <span className="places__sorting-type" tabIndex={0}>
                  Popular
                  <svg className="places__sorting-arrow" width="7" height="4">
                    <use xlinkHref="#icon-arrow-select"></use>
                  </svg>
                </span>
                <ul className="places__options places__options--custom">
                  <li className="places__option places__option--active" tabIndex={0}>Popular</li>
                  <li className="places__option" tabIndex={0}>Price: low to high</li>
                  <li className="places__option" tabIndex={0}>Price: high to low</li>
                  <li className="places__option" tabIndex={0}>Top rated first</li>
                </ul>
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
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default MainPage;
