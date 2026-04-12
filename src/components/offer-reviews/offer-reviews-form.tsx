import { useState, ChangeEvent, FormEvent, Fragment } from 'react';
import { REVIEW_LIMIT } from '../../const';
import { useAppDispatch, useAppSelector } from '../../store';
import { postReviewAction } from '../../store/api-actions';
import { getCurrentOffer } from '../../store/selectors';

type FormData = {
  rating: number | null;
  review: string;
}

type RatingOption = {
  value: number;
  title: string;
  id: string;
}

const RATING_OPTIONS: RatingOption[] = [
  { value: 5, title: 'perfect', id: '5-stars' },
  { value: 4, title: 'good', id: '4-stars' },
  { value: 3, title: 'not bad', id: '3-stars' },
  { value: 2, title: 'badly', id: '2-stars' },
  { value: 1, title: 'terribly', id: '1-stars' },
];

function ReviewsForm(): JSX.Element {
  const dispatch = useAppDispatch();
  const currentOffer = useAppSelector(getCurrentOffer);
  const [formData, setFormData] = useState<FormData>({
    rating: null,
    review: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFieldChange = (evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = evt.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'radio' ? Number(value) : value,
    }));
    if (error) {
      setError(null);
    }
  };

  const onSubmit = () => {
    if (currentOffer && formData.rating) {
      dispatch(postReviewAction({
        offerId: currentOffer.id,
        review: {
          comment: formData.review,
          rating: formData.rating,
        }
      })).unwrap()
        .then(() => {
          setFormData({
            rating: null,
            review: '',
          });
          setError(null);
        })
        .catch(() => {
          setError('Failed to submit review. Please try again.');
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  };

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setIsSubmitting(true);
    setError(null);
    onSubmit();
  };

  const isSubmitDisabled = !formData.rating ||
    formData.review.length < REVIEW_LIMIT.MIN ||
    formData.review.length > REVIEW_LIMIT.MAX ||
    isSubmitting;

  return (
    <form className="reviews__form form" action="#" method="post" onSubmit={handleSubmit}>
      <label className="reviews__label form__label" htmlFor="review">Your review</label>
      {error && (
        <div className="reviews__error" style={{
          backgroundColor: '#ff4444',
          color: 'white',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '15px',
          textAlign: 'center'
        }}
        >
          {error}
        </div>
      )}

      <div className="reviews__rating-form form__rating">
        {RATING_OPTIONS.map(({ value, title, id }) => (
          <Fragment key={value}>
            <input
              className="form__rating-input visually-hidden"
              name="rating"
              value={value}
              id={id}
              type="radio"
              onChange={handleFieldChange}
              checked={formData.rating === value}
              disabled={isSubmitting}
            />
            <label htmlFor={id} className="reviews__rating-label form__rating-label" title={title}>
              <svg className="form__star-image" width="37" height="33">
                <use xlinkHref="#icon-star"></use>
              </svg>
            </label>
          </Fragment>
        ))}
      </div>

      <textarea
        className="reviews__textarea form__textarea"
        id="review"
        name="review"
        placeholder="Tell how was your stay, what you like and what can be improved"
        onChange={handleFieldChange}
        value={formData.review}
        disabled={isSubmitting}
      />

      <div className="reviews__button-wrapper">
        <p className="reviews__help">
          To submit review please make sure to set <span className="reviews__star">rating</span> and describe your stay with at least <b className="reviews__text-amount">{REVIEW_LIMIT.MIN} characters</b>.
        </p>
        <button
          className="reviews__submit form__submit button"
          type="submit"
          disabled={isSubmitDisabled}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </form>
  );
}

export default ReviewsForm;
