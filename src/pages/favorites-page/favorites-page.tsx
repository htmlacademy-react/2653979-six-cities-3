import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import { Helmet } from 'react-helmet-async';
import { CARD_MODE } from '../../const';

import Card from '../../components/card/card';

import { useAppSelector } from '../../store';
import { selectFavoritesByCity } from '../../store/selectors';

function FavoritesPage(): JSX.Element {
  const favoritesByCity = useAppSelector(selectFavoritesByCity);
  const sortedCities = Object.keys(favoritesByCity).sort();

  const hasFavorites = Object.keys(favoritesByCity).length > 0;

  return (
    <>
      <Helmet>
        <title>Favorites</title>
      </Helmet>
      <div className={!hasFavorites ? 'page page--favorites-empty' : 'page'}>
        <Header />
        <main className={!hasFavorites ? 'page__main page__main--favorites page__main--favorites-empty' : 'page__main page__main--favorites'}>
          <div className="page__favorites-container container">
            {!hasFavorites && (
              <section className="favorites favorites--empty">
                <h1 className="visually-hidden">Favorites (empty)</h1>
                <div className="favorites__status-wrapper">
                  <b className="favorites__status">Nothing yet saved.</b>
                  <p className="favorites__status-description">Save properties to narrow down search or plan your future trips.</p>
                </div>
              </section>
            )}
            {hasFavorites && (
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
                        {favoritesByCity[city].map((offer) => (
                          <Card
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
    </>
  );
}

export default FavoritesPage;
