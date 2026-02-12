import Header from '../../components/header/header';
import OfferGallery from '../../components/offer-gallery/offer-gallery';
import OfferWrapper from '../../components/offer-wrapper/offer-wrapper';
import OfferOther from '../../components/offer-other/offer-other';

function OfferPage(): JSX.Element {
  return (
    <div className="page">
      <Header />
      <main className="page__main page__main--offer">
        <section className="offer">
          <OfferGallery />
          <OfferWrapper />
          <section className="offer__map map"></section>
        </section>
        <OfferOther />
      </main>
    </div>
  );
}

export default OfferPage;
