import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Simple component for testing
const TestComponent: React.FC<{ message: string }> = ({ message }) => {
  return <div data-testid="test-message">{message}</div>;
};

describe('Simple React Test', () => {
  it('should render a simple React component', () => {
    render(<TestComponent message="Hello World" />);
    
    const element = screen.getByTestId('test-message');
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent('Hello World');
  });

  it('should render different props', () => {
    render(<TestComponent message="Different message" />);
    
    const element = screen.getByTestId('test-message');
    expect(element).toHaveTextContent('Different message');
  });
});
