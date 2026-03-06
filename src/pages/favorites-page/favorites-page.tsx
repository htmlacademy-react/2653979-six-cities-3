import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import { Helmet } from 'react-helmet-async';
import { Offer } from '../../types/offer';
import { CARD_MODE } from '../../const';

import Card from '../../components/card/card';

type FavoritesPageProps = {
  offers: Offer[];
};

function FavoritesPage({ offers }: FavoritesPageProps): JSX.Element {
  const favoriteOffers = offers.filter((off) => off.isFavorite === true);
  const groupedByCity = favoriteOffers.reduce((groups, offer) => {
    const cityName = offer.city.name;
    if (!groups[cityName]) {
      groups[cityName] = [];
    }
    groups[cityName].push(offer);
    return groups;
  }, {} as Record<string, Offer[]>);

  const sortedCities = Object.keys(groupedByCity).sort((a, b) => a.localeCompare(b));
  <Helmet>
    <title>Favorites</title>
  </Helmet>;
  return (
    <div className={favoriteOffers.length <= 0 ? ('page page--favorites-empty') : ('page')}>
      <Header />
      <main className={favoriteOffers.length <= 0 ? ('page__main page__main--favorites page__main--favorites-empty') : ('page__main page__main--favorites')}>
        <div className="page__favorites-container container">
          {favoriteOffers.length <= 0 && (
            <section className="favorites favorites--empty">
              <h1 className="visually-hidden">Favorites (empty)</h1>
              <div className="favorites__status-wrapper">
                <b className="favorites__status">Nothing yet saved.</b>
                <p className="favorites__status-description">Save properties to narrow down search or plan your future trips.</p>
              </div>
            </section>
          )}
          {favoriteOffers.length > 0 && (
            <section className="favorites">
              <h1 className="favorites__title">Saved listing</h1>
              <ul className="favorites__list">
                {sortedCities.map((city) => (
                  <li className="favorites__locations-items" key={city}>
                    <div className="favorites__locations locations locations--current">
                      <div className="locations__item">
                        <a className="locations__item-link" href="#">
                          <span>{city}</span>
                        </a>
                      </div>
                    </div>
                    <div className="favorites__places">
                      {groupedByCity[city].map((offer) => (
                        < Card
                          mode={CARD_MODE.HORIZONTAL}
                          key={offer.id}
                          data={offer}
                        />
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
export default FavoritesPage;
