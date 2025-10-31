import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react'

import Navbar from './Navbar';

describe('Navbar', () => {
  it('should contain a header', () => {
    render(<Navbar />)

    expect(screen.getByText('Test')).toBeInTheDocument();
  })
})