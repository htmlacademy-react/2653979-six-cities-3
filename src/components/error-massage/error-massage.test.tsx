import { render, screen } from '@testing-library/react';
import ErrorMessage from './error-message';
import { withStore } from '../../utils/mock-component';
import { NameSpace } from '../../const';

describe('Component: ErrorMessage', () => {
  it('should not render anything if there is no error', () => {
    const initialState = {
      [NameSpace.Error]: {
        error: null,
      },
    };

    const { withStoreComponent } = withStore(<ErrorMessage />, initialState);
    render(withStoreComponent);

    expect(screen.queryByText(/./)).not.toBeInTheDocument();
  });

  it('should render error message if error exists', () => {
    const errorText = 'Something went wrong!';
    const initialState = {
      [NameSpace.Error]: {
        error: errorText,
      },
    };

    const { withStoreComponent } = withStore(<ErrorMessage />, initialState);
    render(withStoreComponent);

    const errorElement = screen.getByText(errorText);
    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveClass('error-message');
  });
});
