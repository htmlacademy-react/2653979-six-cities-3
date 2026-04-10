import { render, screen } from '@testing-library/react';
import OfferGallery from './offer-gallery';

describe('Component: OfferGallery', () => {

  it('renders gallery container', () => {
    render(<OfferGallery offerGallery={[]} />);
    expect(screen.getByTestId('offer-gallery-container')).toBeInTheDocument();
  });

  it('renders all provided images up to 6', () => {
    const images = ['img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg', 'img5.jpg', 'img6.jpg', 'img7.jpg'];
    render(<OfferGallery offerGallery={images} />);

    const renderedImages = screen.getAllByAltText('Photo studio');
    expect(renderedImages).toHaveLength(6);
    images.slice(0, 6).forEach((src, index) => {
      expect(renderedImages[index]).toHaveAttribute('src', src);
    });
  });

  it('ignores empty string images', () => {
    const images: string[] = ['img1.jpg', '', 'img2.jpg'];
    render(<OfferGallery offerGallery={images} />);

    const renderedImages = screen.getAllByAltText('Photo studio');
    expect(renderedImages).toHaveLength(2);
    expect(renderedImages[0]).toHaveAttribute('src', 'img1.jpg');
    expect(renderedImages[1]).toHaveAttribute('src', 'img2.jpg');
  });

});
