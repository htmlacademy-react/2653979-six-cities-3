import Card from '../../components/card/card';
import { Offer } from '../../types/offer';
import { CARD_MODE, NameSpace } from '../../const';

import Spinner from '../../components/spinner/spinner';
import { useAppSelector } from '../../store';
import { AuthorizationStatus } from '../../const';

type OfferListProps = {
  cardView: number;
  offers: Offer[];
  onActiveCardToggle: (cardId: string | null) => void;
}

function OfferList({ cardView, offers, onActiveCardToggle }: OfferListProps): JSX.Element {
  const cards = offers.slice(0, cardView);
  const authorizationStatus = useAppSelector((state) => state[NameSpace.User].authorizationStatus);
  const isOffersLoading = useAppSelector((state) => state[NameSpace.Data].isOffersDataLoading);
  if (authorizationStatus === AuthorizationStatus.Unknown || isOffersLoading) {
    return (
      <Spinner/>
    );
  }
  return (
    <div className="cities__places-list places__list tabs__content">
      {
        cards.map((card) => (
          < Card
            key={card.id}
            data={card}
            mode={CARD_MODE.VERTICAL}
            onMouseEnter={() => onActiveCardToggle(card.id)}
            onMouseLeave={() => onActiveCardToggle(null)}
          />
        ))
      }
    </div>
  );
}

export default OfferList;
