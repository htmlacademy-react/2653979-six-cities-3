import { render, screen } from '@testing-library/react';
import NotFoundPage from './not-found-page';
import { withHistory } from '../../utils/mock-component';

describe('Not found page', () => {
  it('should render correctly', () => {
    const expectedText = /404 Not Found/i;
    const preparedComponent = withHistory(<NotFoundPage />);
    render(preparedComponent);

    expect(screen.getByText(expectedText)).toBeInTheDocument();
    expect(screen.getByText(/Go home/i)).toBeInTheDocument();
  });
});
