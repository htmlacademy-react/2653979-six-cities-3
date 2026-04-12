import Header from '../../components/header/header';
import OfferGallery from '../../components/offer-gallery/offer-gallery';
import OfferWrapper from '../../components/offer-wrapper/offer-wrapper';
import OfferOther from '../../components/offer-other/offer-other';
import { Helmet } from 'react-helmet-async';
import { useParams, Navigate } from 'react-router-dom';
import { APP_ROUTE, MAP_TYPE, CARD_OTHER_VIEW } from '../../const';
import Map from '../../components/map/map';
import { useAppDispatch, useAppSelector } from '../../store';
import { getCurrentOffer, getIsCurrentOfferLoading, getNearbyOffers } from '../../store/selectors';
import { useEffect } from 'react';
import Spinner from '../../components/spinner/spinner';
import { fetchCurrentOfferAction, fetchNearbyOffersAction, fetchReviewsAction } from '../../store/api-actions';

function OfferPage(): JSX.Element {
  const cardOtherView = CARD_OTHER_VIEW;
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const isCurrentOfferLoading = useAppSelector(getIsCurrentOfferLoading);

  const currentOffer = useAppSelector(getCurrentOffer);
  const nearbyOffers = useAppSelector(getNearbyOffers);

  useEffect(() => {
    if (id) {
      dispatch(fetchCurrentOfferAction(id));
      dispatch(fetchReviewsAction(id));
      dispatch(fetchNearbyOffersAction(id));
    }
  }, [dispatch, id]);

  if (isCurrentOfferLoading) {
    return <Spinner />;
  }

  if (!currentOffer) {
    return <Navigate to={APP_ROUTE.NotFound} />;
  }

  return (
    <div className="page">
      <Helmet>
        <title>Offer</title>
      </Helmet>
      <Header />
      <main className="page__main page__main--offer">
        <section className="offer">
          {currentOffer.images.length > 0 && (
            <OfferGallery offerGallery={currentOffer.images} />
          )}
          <OfferWrapper
            offerData={currentOffer}
          />
          <Map
            city={currentOffer.city}
            offers={[currentOffer].concat(nearbyOffers.slice(0, cardOtherView))}
            type={MAP_TYPE.OFFERPAGE}
            activeOffer={currentOffer.id}
            allowHover
          />
        </section>
        <OfferOther
          cardOtherView={cardOtherView}
          offers={nearbyOffers}
        />
      </main>
    </div>
  );
}

export default OfferPage;
