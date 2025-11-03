import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react'
import CategoriesDropdown from './Categories-Dropdown';

describe('Categories-Dropdown', () => {
    it('should render', () => {
        render(<CategoriesDropdown />)

        expect(screen.findByText('Entrées')).toBeTruthy();
        expect(screen.findByText('Plats')).toBeTruthy();
        expect(screen.findByText('Desserts')).toBeTruthy();
    })
})