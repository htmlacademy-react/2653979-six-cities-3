import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LocationItem from './location-item';
import { MemoryRouter } from 'react-router-dom';
import { City } from '../../types/city';

const mockCity: City = {
  name: 'Paris',
  location: {
    latitude: 0,
    longitude: 0,
    zoom: 10,
  },
};

function renderComponent({
  isActive = false,
  onClick = () => { },
}: {
  isActive?: boolean;
  onClick?: () => void;
} = {}) {
  return render(
    <MemoryRouter>
      <LocationItem
        city={mockCity}
        isActive={isActive}
        onClick={onClick}
      />
    </MemoryRouter>
  );
}

describe('Component: LocationItem', () => {

  it('should render city name', () => {
    renderComponent();

    expect(screen.getByText('Paris')).toBeInTheDocument();
  });

  it('should apply active class when isActive = true', () => {
    renderComponent({ isActive: true });

    const link = screen.getByRole('link');

    expect(link).toHaveClass('tabs__item--active');
  });

  it('should NOT apply active class when isActive = false', () => {
    renderComponent({ isActive: false });

    const link = screen.getByRole('link');

    expect(link).not.toHaveClass('tabs__item--active');
  });

  it('should call onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    renderComponent({ onClick: handleClick });

    const link = screen.getByRole('link');

    await user.click(link);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should prevent default behavior on click', () => {
    const handleClick = vi.fn();

    renderComponent({ onClick: handleClick });

    const link = screen.getByRole('link');

    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });

    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

    link.dispatchEvent(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

});
