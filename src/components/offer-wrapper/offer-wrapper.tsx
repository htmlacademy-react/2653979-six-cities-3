import OfferReviewsList from '../offer-reviews/offer-reviews-list';
import { Offer } from '../../types/offer';
import { useAppSelector } from '../../store';
import { getAuthorizationStatus } from '../../store/selectors';
import { AuthorizationStatus } from '../../const';

type OfferProps = {
  offerData: Offer;
}

function OfferWrapper({ offerData }: OfferProps): JSX.Element {
  const { isPremium, title, rating, type, bedrooms, maxAdults, price, goods, host, description } = offerData;
  const ratingStars = `${rating * 20}%`;
  const authorizationStatus = useAppSelector(getAuthorizationStatus);
  return (
    <div className="offer__container container">
      <div className="offer__wrapper">
        {isPremium && (
          <div className="offer__mark">
            <span>Premium</span>
          </div>
        )}
        <div className="offer__name-wrapper">
          <h1 className="offer__name">
            {title}
          </h1>
          <button className="offer__bookmark-button button" type="button">
            <svg className="offer__bookmark-icon" width="31" height="33">
              <use xlinkHref="#icon-bookmark"></use>
            </svg>
            <span className="visually-hidden">To bookmarks</span>
          </button>
        </div>
        <div className="offer__rating rating">
          <div className="offer__stars rating__stars">
            <span style={
              {
                width: ratingStars,
              }
            }
            >
            </span>
            <span className="visually-hidden">Rating</span>
          </div>
          <span className="offer__rating-value rating__value">{rating}</span>
        </div>
        <ul className="offer__features">
          <li className="offer__feature offer__feature--entire">
            {type}
          </li>
          <li className="offer__feature offer__feature--bedrooms">
            {bedrooms} Bedrooms
          </li>
          <li className="offer__feature offer__feature--adults">
            Max {maxAdults} adults
          </li>
        </ul>
        <div className="offer__price">
          <b className="offer__price-value">&euro;{price}</b>
          <span className="offer__price-text">&nbsp;night</span>
        </div>

        {goods.length > 0 &&
          (
            <div className="offer__inside">
              <h2 className="offer__inside-title">What&apos;s inside</h2>
              <ul className="offer__inside-list">
                {goods.map((good) =>
                  good && (
                    <li className="offer__inside-item" key={good} >
                      {good}
                    </li>
                  )
                )}
              </ul>
            </div>

          )}
        {host && (
          <div className="offer__host">
            <h2 className="offer__host-title">Meet the host</h2>
            <div className="offer__host-user user">
              <div className="offer__avatar-wrapper offer__avatar-wrapper--pro user__avatar-wrapper">
                <img className="offer__avatar user__avatar" src={host.avatarUrl} width="74" height="74" alt="Host avatar" />
              </div>
              <span className="offer__user-name">
                {host.name}
              </span>
              {host.isPro && (
                <span className="offer__user-status">
                  Pro
                </span>
              )}
            </div>
            {description && (
              <div className="offer__description">
                <p className="offer__text">
                  {description}
                </p>
              </div>
            )}
          </div>
        )}
        {authorizationStatus === AuthorizationStatus.Auth && <OfferReviewsList />}

      </div>
    </div >
  );
}

export default OfferWrapper;
