import Card from '../../components/card/card';
import { mockOffer } from '../../mock/mock-offer';
import { Helmet } from 'react-helmet-async';

import Header from '../../components/header/header';

type MainPageProps = {
  cardView: number;
  offerCount: number;
  cities: string[];
}

function MainPage({ cardView, offerCount, cities }: MainPageProps): JSX.Element {
  const cards = mockOffer.slice(0, cardView);
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
                  <li className="locations__item" key={city}>
                    <a className={`locations__item-link tabs__item ${index === 0 ? 'tabs__item--active' : ''}`} href="#">
                      <span>{city}</span>
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
              <b className="places__found">{offerCount} places to stay in Amsterdam</b>
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
              <div className="cities__places-list places__list tabs__content">

                {cards.map((card) => (
                  <Card
                    key={card.id}
                    data={card}
                  />
                ))}
              </div>
            </section>
            <div className="cities__right-section">
              <section className="cities__map map"></section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default MainPage;
