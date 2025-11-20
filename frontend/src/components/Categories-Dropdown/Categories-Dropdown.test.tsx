import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import CategoriesDropdown from './Categories-Dropdown';
import { BrowserRouter } from 'react-router';

describe('Categories-Dropdown', () => {
  const categories = [
    { id: 1, name: 'Entrées', created_at: '2023-01-01', updated_at: '2023-01-01' },
    { id: 2, name: 'Plats', created_at: '2023-01-01', updated_at: '2023-01-01' },
    { id: 3, name: 'Desserts', created_at: '2023-01-01', updated_at: '2023-01-01' },
  ];

  it('should render all categories', async () => {
    render(
      <BrowserRouter>
        <CategoriesDropdown value="" onChange={() => {}} categories={categories} isResetVisible={true} />
      </BrowserRouter>
    );

    // await findByText car c'est async
    expect(await screen.findByText('Entrées')).toBeTruthy();
    expect(await screen.findByText('Plats')).toBeTruthy();
    expect(await screen.findByText('Desserts')).toBeTruthy();
  });

  it('should call onChange and update summary text when a category is clicked', async () => {
    const handleChange = vi.fn();

    render(
      <BrowserRouter>
        <CategoriesDropdown value="" onChange={handleChange} categories={categories} isResetVisible={true} />
      </BrowserRouter>
    );

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
