import { Helmet } from 'react-helmet-async';

import Header from '../../components/header/header';
import LocationList from './location-list';
import CardsMap from '../../components/cities/cards-map';
import { useAppSelector } from '../../store';
import { selectHasOffersInCurrentCity } from '../../store/selectors';

function MainPage(): JSX.Element {
  const hasOffersInCurrentCity = useAppSelector(selectHasOffersInCurrentCity);
  return (
    <div className="page page--gray page--main">
      <Helmet>
        <title>6 Cities</title>
      </Helmet>
      <Header />
      <main className={`page__main page__main--index ${!hasOffersInCurrentCity ? 'page__main--index-empty' : ''}`}>
        <h1 className="visually-hidden">Cities</h1>
        <LocationList />
        <CardsMap />
      </main>
    </div>
  );
}

export default MainPage;
