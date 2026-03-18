import { SORT_TYPE, SortType } from '../../const';

type SortProps = {
  currentSort: SortType;
  onSortChange: (sortType: SortType) => void;
  isOpen?: boolean;
}

function Sort({ currentSort, onSortChange, isOpen = false }: SortProps): JSX.Element {
  const sortTypes = Object.values(SORT_TYPE);

  return (
    <ul className={`places__options places__options--custom ${isOpen ? 'places__options--opened' : ''}`}>
      {sortTypes.map((sortType) => (
        <li
          className={`places__option ${currentSort === sortType ? 'places__option--active' : ''}`}
          tabIndex={0}
          key={sortType}
          onClick={() => onSortChange(sortType as SortType)}
        >
          {sortType}
        </li>
      ))}
    </ul>
  );
}

export default Sort;
