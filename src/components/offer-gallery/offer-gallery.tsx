type OfferGalleryProps = {
  offerGallery: string[];
}

function OfferGallery({ offerGallery }: OfferGalleryProps): JSX.Element {
  return (
    <div className="offer__gallery-container container" data-testid="offer-gallery-container">
      <div className="offer__gallery">
        {offerGallery.slice(0, 6).map((img, index) => img && (
          <div className="offer__image-wrapper" key={img + index.toString()}>
            <img className="offer__image" src={img} alt="Photo studio" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default OfferGallery;
