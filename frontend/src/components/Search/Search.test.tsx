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

    // On créer une constante de l'input par son rôle
    const input = screen.getByRole('searchbox');

    // On change la valeur de l'input via l'événement "change"
    fireEvent.change(input, { target: { value: 'test' } });

    // On vérifie que l'input contient la valeur "test"
    expect(input).toHaveValue('test');
  });
});
