import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import CategoriesDropdown from './Categories-Dropdown';

describe('Categories-Dropdown', () => {
  const categories = [
    { id: 1, name: 'Entrées', created_at: '2023-01-01', updated_at: '2023-01-01' },
    { id: 2, name: 'Plats', created_at: '2023-01-01', updated_at: '2023-01-01' },
    { id: 3, name: 'Desserts', created_at: '2023-01-01', updated_at: '2023-01-01' },
  ];

  it('should render all categories', () => {
    render(<CategoriesDropdown value='' onChange={() => { }} categories={categories} />);

    expect(screen.findByText('Entrées')).toBeTruthy();
    expect(screen.findByText('Plats')).toBeTruthy();
    expect(screen.findByText('Desserts')).toBeTruthy();
  });

  it('should call onChange and update summary text when a category is clicked', async () => {
    const handleChange = vi.fn();
    render(<CategoriesDropdown value='' onChange={handleChange} categories={categories} />);

    const summary = screen.getByText('Catégorie');
    fireEvent.click(summary);

    const platsItem = screen.getByText('Plats');
    fireEvent.click(platsItem);

    expect(handleChange).toHaveBeenCalledWith('Plats');

    fireEvent.click(summary);
    const dessertsItem = screen.getByText('Desserts');
    fireEvent.click(dessertsItem);

    expect(handleChange).toHaveBeenCalledWith('Desserts');
  });
});
