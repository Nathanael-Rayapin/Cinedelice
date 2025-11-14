import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import ProfileDropdown from './Profile-Dropdown';
import { BrowserRouter } from 'react-router';

describe('Profile-Dropdown', () => {
  it('should render', () => {
    render(
      <BrowserRouter>
        <ProfileDropdown />
      </BrowserRouter>
    );

    expect(screen.getByText('Connexion')).toBeTruthy();
    expect(screen.getByText('Inscription')).toBeTruthy();
  });
});
