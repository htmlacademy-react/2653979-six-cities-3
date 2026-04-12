import Card from '../card/card';
import { Offer } from '../../types/offer';
import { CARD_MODE } from '../../const';

type OfferOtherProps = {
  cardOtherView: number;
  offers: Offer[];
}

function OfferOther({ cardOtherView, offers }: OfferOtherProps): JSX.Element {
  const cards = offers.slice(0, cardOtherView);

  return (
    <div className="container">
      <section className="near-places places">
        <h2 className="near-places__title">Other places in the neighbourhood</h2>
        <div className="near-places__list places__list">
          {cards.map((card) => (
            <Card
              key={card.id}
              data={card}
              mode={CARD_MODE.VERTICAL}
              isNear={true}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default OfferOther;
