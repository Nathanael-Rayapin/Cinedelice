import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react'

import ProfileDropdown from './Profile-Dropdown';

describe('Profile-Dropdown', () => {
  it('should contain a header', () => {
    render(<ProfileDropdown />)

    expect(screen.findByText('Connexion')).toBeTruthy();
    expect(screen.findByText('Inscription')).toBeTruthy();
  })
})