import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import Navbar from './Navbar';
import { BrowserRouter } from 'react-router';

describe('Navbar', () => {
  it('should render', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    expect(screen.findByText('Recettes')).toBeTruthy();
    expect(screen.findByText('Films')).toBeTruthy();
  });
});
