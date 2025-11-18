import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import Search from './Search';

describe('Search', () => {
  it('should contain a header', () => {
    render(<Search />);

    expect(screen.findByText('Rechercher un plat...')).toBeTruthy();
  });

  it('should contain a caracter if the input is filled', () => {
    render(<Search />);

    const input = screen.getByRole('searchbox');

    fireEvent.change(input, { target: { value: 'test' } });

    expect(input).toHaveValue('test');
  });
});
