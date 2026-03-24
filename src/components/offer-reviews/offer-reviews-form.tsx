import { useState, ChangeEvent, FormEvent } from 'react';
import { REVIEW_LIMIT } from '../../const';
import { useAppDispatch, useAppSelector } from '../../store';
import { postReviewAction } from '../../store/api-actions';
import { getCurrentOffer } from '../../store/selectors';

type FormData = {
  rating: number | null;
  review: string;
}

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

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setIsSubmitting(true);
    setError(null);
    void (async () => {
      try {
        if (currentOffer && formData.rating) {
          await dispatch(postReviewAction({
            offerId: currentOffer.id,
            review: {
              comment: formData.review,
              rating: formData.rating,
            }
          })).unwrap();
        }

        setFormData({
          rating: null,
          review: '',
        });
      } catch (err) {
        setError('Failed to submit review. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    })();
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
        <input
          className="form__rating-input visually-hidden"
          name="rating"
          value="5"
          id="5-stars"
          type="radio"
          onChange={handleFieldChange}
          checked={formData.rating === 5}
          disabled={isSubmitting}
        />
        <label htmlFor="5-stars" className="reviews__rating-label form__rating-label" title="perfect">
          <svg className="form__star-image" width="37" height="33">
            <use xlinkHref="#icon-star"></use>
          </svg>
        </label>

        <input
          className="form__rating-input visually-hidden"
          name="rating"
          value="4"
          id="4-stars"
          type="radio"
          onChange={handleFieldChange}
          checked={formData.rating === 4}
          disabled={isSubmitting}
        />
        <label htmlFor="4-stars" className="reviews__rating-label form__rating-label" title="good">
          <svg className="form__star-image" width="37" height="33">
            <use xlinkHref="#icon-star"></use>
          </svg>
        </label>

        <input
          className="form__rating-input visually-hidden"
          name="rating"
          value="3"
          id="3-stars"
          type="radio"
          onChange={handleFieldChange}
          checked={formData.rating === 3}
          disabled={isSubmitting}
        />
        <label htmlFor="3-stars" className="reviews__rating-label form__rating-label" title="not bad">
          <svg className="form__star-image" width="37" height="33">
            <use xlinkHref="#icon-star"></use>
          </svg>
        </label>

        <input
          className="form__rating-input visually-hidden"
          name="rating"
          value="2"
          id="2-stars"
          type="radio"
          onChange={handleFieldChange}
          checked={formData.rating === 2}
          disabled={isSubmitting}
        />
        <label htmlFor="2-stars" className="reviews__rating-label form__rating-label" title="badly">
          <svg className="form__star-image" width="37" height="33">
            <use xlinkHref="#icon-star"></use>
          </svg>
        </label>

        <input
          className="form__rating-input visually-hidden"
          name="rating"
          value="1"
          id="1-star"
          type="radio"
          onChange={handleFieldChange}
          checked={formData.rating === 1}
          disabled={isSubmitting}
        />
        <label htmlFor="1-star" className="reviews__rating-label form__rating-label" title="terribly">
          <svg className="form__star-image" width="37" height="33">
            <use xlinkHref="#icon-star"></use>
          </svg>
        </label>
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
