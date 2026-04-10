import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Sort from './sort';
import { SORT_TYPE, SortType } from '../../const';

describe('Component: Sort', () => {

  function renderComponent({
    currentSort = SORT_TYPE.POPULAR,
    onSortChange = () => { },
  }: {
    currentSort?: SortType;
    onSortChange?: (sort: SortType) => void;
  } = {}) {
    return render(
      <Sort
        currentSort={currentSort}
        onSortChange={onSortChange}
      />
    );
  }

  it('should render current sort type', () => {
    renderComponent();

    expect(
      screen.getByText(SORT_TYPE.POPULAR, {
        selector: '.places__sorting-type',
      })
    ).toBeInTheDocument();
  });

  it('should toggle dropdown on click', async () => {
    const user = userEvent.setup();

    renderComponent();

    const toggle = screen.getByText(SORT_TYPE.POPULAR, {
      selector: '.places__sorting-type',
    });

    const list = screen.getByTestId('sort-options');

    expect(list).not.toHaveClass('places__options--opened');

    await user.click(toggle);
    expect(list).toHaveClass('places__options--opened');

    await user.click(toggle);
    expect(list).not.toHaveClass('places__options--opened');
  });

  it('should render all sort options', async () => {
    const user = userEvent.setup();

    renderComponent();

    const toggle = screen.getByText(SORT_TYPE.POPULAR, {
      selector: '.places__sorting-type',
    });

    await user.click(toggle);

    const list = screen.getByTestId('sort-options');

    Object.values(SORT_TYPE).forEach((option) => {
      expect(within(list).getByText(option)).toBeInTheDocument();
    });
  });

  it('should highlight current sort option', async () => {
    const user = userEvent.setup();

    renderComponent({ currentSort: SORT_TYPE.PRICE_LOW_TO_HIGH });

    const toggle = screen.getByText(SORT_TYPE.PRICE_LOW_TO_HIGH, {
      selector: '.places__sorting-type',
    });

    await user.click(toggle);

    const list = screen.getByTestId('sort-options');

    const active = within(list).getByText(SORT_TYPE.PRICE_LOW_TO_HIGH);

    expect(active).toHaveClass('places__option--active');
  });

  it('should call onSortChange when option clicked', async () => {
    const user = userEvent.setup();
    const handleSortChange = vi.fn();

    renderComponent({ onSortChange: handleSortChange });

    const toggle = screen.getByText(SORT_TYPE.POPULAR, {
      selector: '.places__sorting-type',
    });

    await user.click(toggle);

    const list = screen.getByTestId('sort-options');

    const targetOption = SORT_TYPE.PRICE_HIGH_TO_LOW;

    await user.click(within(list).getByText(targetOption));

    expect(handleSortChange).toHaveBeenCalledWith(targetOption);
  });

  it('should close dropdown after selecting option', async () => {
    const user = userEvent.setup();

    renderComponent();

    const toggle = screen.getByText(SORT_TYPE.POPULAR, {
      selector: '.places__sorting-type',
    });

    await user.click(toggle);

    const list = screen.getByTestId('sort-options');
    expect(list).toHaveClass('places__options--opened');

    await user.click(
      within(list).getByText(SORT_TYPE.PRICE_HIGH_TO_LOW)
    );

    expect(list).not.toHaveClass('places__options--opened');
  });

});
