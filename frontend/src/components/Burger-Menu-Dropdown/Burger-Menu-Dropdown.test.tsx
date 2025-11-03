import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react'
import BurgerMenuDropdown from './Burger-Menu-Dropdown';

describe('Burger-Menu-Dropdown', () => {
    it('should render', () => {
        render(<BurgerMenuDropdown />)

        expect(screen.findByText('Recettes')).toBeTruthy();
        expect(screen.findByText('Films')).toBeTruthy();
    })
})