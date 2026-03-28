import { useState } from 'react';
import { CARD_VIEW, MAP_TYPE, SORT_TYPE, SortType } from '../../const';
import { useAppSelector } from '../../store';
import { selectOffersCount, selectSortedOffers, setCity as selectCurrentCity } from '../../store/selectors';
import Sort from '../../pages/main-page/sort';
import OfferList from '../offer-list/offer-list';
import Map from '../map/map';


function CardsMap(): JSX.Element {
  const cardView = CARD_VIEW;

  const [currentSort, setCurrentSort] = useState<SortType>(SORT_TYPE.POPULAR);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  const currentCity = useAppSelector(selectCurrentCity);
  const offers = useAppSelector((state) => selectSortedOffers(state, currentSort));
  const offersCount = useAppSelector(selectOffersCount);

  const handleActiveCardToggle = (cardId: string | null) => {
    setActiveCardId(cardId);
  };

  const handleSortChange = (sortType: SortType) => {
    setCurrentSort(sortType);
  };

  return (
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
  );
}

export default CardsMap;
