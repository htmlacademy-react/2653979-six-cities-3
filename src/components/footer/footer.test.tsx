import { render, screen } from '@testing-library/react';
import Footer from './footer';
import { withHistory, withStore } from '../../utils/mock-component';

describe('Component: Footer', () => {

  const renderFooter = () => {
    const { withStoreComponent } = withStore(<Footer />);
    render(withHistory(withStoreComponent));
  };

  it('should render footer element', () => {
    renderFooter();
    expect(document.querySelector('footer.footer')).toBeInTheDocument();
  });

  it('should render logo link', () => {
    renderFooter();
    const logoLink = screen.getByRole('link', { name: /6 cities logo/i });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute('href', 'main.html');
  });

  it('should render logo image with correct attributes', () => {
    renderFooter();
    const logoImg = screen.getByAltText('6 cities logo');

    expect(logoImg).toBeInTheDocument();
    expect(logoImg).toHaveAttribute('src', 'img/logo.svg');
    expect(logoImg).toHaveAttribute('width', '64');
    expect(logoImg).toHaveAttribute('height', '33');
  });
});
