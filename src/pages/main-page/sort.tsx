import { useState } from 'react';
import { SORT_TYPE, SortType } from '../../const';

type SortProps = {
  currentSort: SortType;
  onSortChange: (sortType: SortType) => void;
}

function Sort({ currentSort, onSortChange }: SortProps): JSX.Element {
  const sortTypes = Object.values(SORT_TYPE);
  const [isOpen, setIsOpen] = useState(false);

  const handleSortClick = (sortType: SortType) => {
    onSortChange(sortType);
    setIsOpen(false);
  };

  return (
    <form className="places__sorting" action="#" method="get">
      <span className="places__sorting-caption">Sort by</span>
      <span
        className="places__sorting-type"
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)}
      >
        {currentSort}
        <svg className="places__sorting-arrow" width="7" height="4">
          <use xlinkHref="#icon-arrow-select"></use>
        </svg>
      </span>
      <ul data-testid="sort-options" className={`places__options places__options--custom ${isOpen ? 'places__options--opened' : ''}`}>
        {sortTypes.map((sortType) => (
          <li
            className={`places__option ${currentSort === sortType ? 'places__option--active' : ''}`}
            tabIndex={0}
            key={sortType}
            onClick={() => handleSortClick(sortType as SortType)}
          >
            {sortType}
          </li>
        ))}
      </ul>
    </form>
  );
}

export default Sort;
