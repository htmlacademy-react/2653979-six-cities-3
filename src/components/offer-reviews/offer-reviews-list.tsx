import OfferReviewsItem from './offer-reviews-item';
import ReviewsForm from './offer-reviews-form';
import { AuthorizationStatus, REVIEW_LIMIT } from '../../const';
import { useAppSelector } from '../../store';
import { getAuthorizationStatus, getReviews } from '../../store/selectors';

function OfferReviewsList(): JSX.Element {
  const reviews = useAppSelector(getReviews);
  const safeReviews = Array.isArray(reviews) ? reviews : [];
  const reviewsView = safeReviews.slice(0, REVIEW_LIMIT.REVIEWS_COUNT);
  const authorizationStatus = useAppSelector(getAuthorizationStatus);
  return (
    <section className="offer__reviews reviews">
      <h2 className="reviews__title">Reviews &middot; <span className="reviews__amount">{safeReviews.length}</span></h2>
      <ul className="reviews__list">
        {reviewsView.map((review) => (
          <OfferReviewsItem
            key={review.id}
            data={review}
          />
        ))}
      </ul>
      {authorizationStatus === AuthorizationStatus.Auth && <ReviewsForm />}
    </section>
  );
}

export default OfferReviewsList;
