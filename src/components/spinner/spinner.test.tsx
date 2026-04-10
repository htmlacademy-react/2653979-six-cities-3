import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Spinner from './spinner';

describe('Spinner', () => {
  it('renders spinner component', () => {
    render(<Spinner />);

    const spinnerContainer = screen.getByTestId('spinner');
    expect(spinnerContainer).toBeInTheDocument();
    expect(spinnerContainer).toHaveClass('spinner-container');
  });

  it('contains spinner element', () => {
    render(<Spinner />);

    const spinnerContainer = screen.getByTestId('spinner');
    const spinnerElement = spinnerContainer.querySelector('.spinner');

    expect(spinnerElement).toBeInTheDocument();
    expect(spinnerElement).toHaveClass('spinner');
  });

  it('has correct DOM structure', () => {
    render(<Spinner />);

    const spinnerContainer = screen.getByTestId('spinner');

    expect(spinnerContainer.children).toHaveLength(1);

    const childElement = spinnerContainer.children[0];
    expect(childElement).toHaveClass('spinner');
  });

  it('renders without crashing', () => {
    expect(() => render(<Spinner />)).not.toThrow();
  });
});
