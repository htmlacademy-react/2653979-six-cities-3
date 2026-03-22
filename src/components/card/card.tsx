import { Link } from 'react-router-dom';
import { Offer } from '../../types/offer';
import { APP_ROUTE, CARD_MODE } from '../../const';

type CardMode = typeof CARD_MODE[keyof typeof CARD_MODE];

type OfferCardProps = {
  data: Offer;
  mode: CardMode;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

function Card({ data, mode, onMouseEnter, onMouseLeave }: OfferCardProps): JSX.Element {
  const { isPremium, rating, previewImage, price, isFavorite, type, title, id } = data;
  const ratingStars = `${rating * 20}%`;

  const modeClasses = {
    [CARD_MODE.VERTICAL]: 'cities',
    [CARD_MODE.HORIZONTAL]: 'favorites',
  };

  const cardMode = modeClasses[mode] || 'cities';

  return (
    <article className={`${`${cardMode }__card`} place-card`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {isPremium && (
        <div className="place-card__mark">
          <span>Premium</span>
        </div>
      )}
      <div className={`${`${cardMode }__image-wrapper`} place-card__image-wrapper`}>
        <Link to={`${APP_ROUTE.Offer.replace(':id', id)}`}>
          <img className="place-card__image" src={previewImage} width={cardMode === 'cities' ? '260' : '150'} height={cardMode === 'cities' ? '200' : '110'} alt="Place image" />
        </Link>
      </div>
      <div className={cardMode === 'favorites' ? 'favorites__card-info place-card__info' : 'place-card__info'}>
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">&euro;{price}</b>
            <span className="place-card__price-text">&#47;&nbsp;night</span>
          </div>
          <button className={isFavorite ? 'place-card__bookmark-button place-card__bookmark-button--active button' : 'place-card__bookmark-button  button'} type="button">
            <svg className="place-card__bookmark-icon" width="18" height="19">
              <use xlinkHref="#icon-bookmark"></use>
            </svg>
            <span className="visually-hidden">To bookmarks</span>
          </button>
        </div>
        <div className="place-card__rating rating">
          <div className="place-card__stars rating__stars">
            <span style={
              {
                width: ratingStars,
              }
            }
            >
            </span>
            <span className="visually-hidden">Rating</span>
          </div>
        </div>
        <h2 className="place-card__name">
          <Link to={`${APP_ROUTE.Offer.replace(':id', id)}`}>{title}</Link>
        </h2>
        <p className="place-card__type">{type}</p>
      </div>
    </article>
  );
}

export default Card;
