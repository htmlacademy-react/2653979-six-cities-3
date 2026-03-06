import { Review } from '../../types/review';
import OfferReviewsItem from './offer-reviews-item';
import ReviewsForm from './offer-reviews-form';

type ReviewsListProps = {
  reviews: Review[];
}

function OfferReviewsList({ reviews }: ReviewsListProps): JSX.Element {
  return (
    <section className="offer__reviews reviews">
      <h2 className="reviews__title">Reviews &middot; <span className="reviews__amount">1</span></h2>
      <ul className="reviews__list">
        {reviews.map((review) => (
          <OfferReviewsItem
            key={review.id}
            data={review}
          />
        ))}
      </ul>
      {<ReviewsForm/>};
    </section>
  );
}

export default OfferReviewsList;
