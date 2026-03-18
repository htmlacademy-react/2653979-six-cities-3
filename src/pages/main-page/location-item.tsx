import { City } from '../../types/city';
import { Link } from 'react-router-dom';

type LocationItemProps = {
  city: City;
  isActive: boolean;
  onClick: () => void;
}

function LocationItem({ city, isActive, onClick }: LocationItemProps): JSX.Element {
  return (
    <li className="locations__item">
      <Link
        className={`locations__item-link tabs__item ${isActive ? 'tabs__item--active' : ''}`}
        to="#"
        onClick={(evt) => {
          evt.preventDefault();
          onClick();
        }}
      >
        <span>{city.name}</span>
      </Link>
    </li>
  );
}

export default LocationItem;
