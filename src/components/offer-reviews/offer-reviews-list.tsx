import { Review } from '../../types/review';
import OfferReviewItem from './offer-reviews-item';
import ReviewsForm from './offer-reviews-form';
import { REVIEW_LIMIT } from '../../const';

type ReviewsListProps = {
  reviews: Review[];
}

function OfferReviewsList({ reviews }: ReviewsListProps): JSX.Element {
  const reviewsView = reviews.slice(0, REVIEW_LIMIT.REVIEWS_COUNT);
  return (
    <section className="offer__reviews reviews">
      <h2 className="reviews__title">Reviews &middot; <span className="reviews__amount">{reviews.length}</span></h2>
      <ul className="reviews__list">
        {reviewsView.map((review) => (
          <OfferReviewItem
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
