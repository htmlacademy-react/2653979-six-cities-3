import { useState } from 'react';
import Card from '../../components/card/card';
import { Offer } from '../../types/offer';
type OfferListProps = {
  cardView: number;
  offers: Offer[];
}

function OfferList({ cardView, offers }: OfferListProps): JSX.Element {
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const handleCardHover = (cardId: string) => {
    setActiveCardId(cardId);

    // eslint-disable-next-line no-console
    console.log(activeCardId);

  };


  const cards = offers.slice(0, cardView);
  return (
    <div className="cities__places-list places__list tabs__content">
      {cards.map((card) => (
        < Card
          onMouseEnter={() => handleCardHover(card.id)}
          key={card.id}
          data={card}
        />
      ))}
    </div>
  );
}

export default OfferList;
