import Header from '../../components/header/header';
import OfferGallery from '../../components/offer-gallery/offer-gallery';
import OfferWrapper from '../../components/offer-wrapper/offer-wrapper';
import OfferOther from '../../components/offer-other/offer-other';
import { Helmet } from 'react-helmet-async';
import { Offer } from '../../types/offer';
import { useParams, Navigate } from 'react-router-dom';
import { APP_ROUTE, MAP_TYPE } from '../../const';
import { Review } from '../../types/review';
import Map from '../../components/map/map';

type OfferPageProps = {
  offers: Offer[];
  cardOtherView: number;
  reviews: Review[];
}

function OfferPage({ offers, cardOtherView, reviews }: OfferPageProps): JSX.Element {
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
          <OfferWrapper
            offerData={offer}
            rewiews={reviews}
          />
          <Map
            city={offer.city}
            offers={[offer]}
            type={MAP_TYPE.OFFERPAGE}
            activeOffer={offer.id}
            allowHover={false}
          />
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
