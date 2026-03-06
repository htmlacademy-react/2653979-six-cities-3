import Header from '../../components/header/header';
import OfferGallery from '../../components/offer-gallery/offer-gallery';
import OfferWrapper from '../../components/offer-wrapper/offer-wrapper';
import OfferOther from '../../components/offer-other/offer-other';
import { Helmet } from 'react-helmet-async';
import { Offer } from '../../types/offer';
import { useParams, Navigate } from 'react-router-dom';
import { APP_ROUTE } from '../../const';

type OfferPageProps = {
  offers: Offer[];
  cardOtherView: number;
}

function OfferPage({ offers, cardOtherView }: OfferPageProps): JSX.Element {
  const params = useParams();
  const offer = offers.find((off) => off.id === params.id);
  if (!offer) {
    return <Navigate to={APP_ROUTE.Root} />;
  }
  return (
    <div className="page">
      <Helmet>
        <title>Offer</title>
      </Helmet>
      <Header />
      <main className="page__main page__main--offer">
        <section className="offer">
          {offer.images.length > 0 && (
            <OfferGallery offerGallery={offer.images} />
          )}
          <OfferWrapper offerData={offer} />
          <section className="offer__map map"></section>
        </section>
        <OfferOther
          cardOtherView={cardOtherView}
          offers={offers}
        />
      </main>
    </div>
  );
}

export default OfferPage;
