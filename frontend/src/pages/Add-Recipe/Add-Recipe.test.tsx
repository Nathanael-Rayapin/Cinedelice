import {
    fireEvent,
    render,
    screen,
    waitFor,
    type ByRoleMatcher,
    type ByRoleOptions,
} from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BrowserRouter } from 'react-router';
import AddRecipe from './Add-Recipe';

vi.mock('awesome-snackbar', () => {
  return {
    default: class {
      view = document.createElement('div');
      show() {}
      hide() {}
      getHeight() { return 0; }
      adjustListPositions() {}
    },
  };
});

describe('Add Recipe Form', () => {
    beforeEach(() => {
        render(
            <BrowserRouter>
                <AddRecipe />
            </BrowserRouter>
        );
    });

    it('should not submit if the recipe title is empty', async () => {
        const titleInput = screen.getByLabelText(/Titre de la recette/);
        const submitButton = screen.getByRole('button', { name: /Confirmer/ });

        fireEvent.change(titleInput, { target: { value: '' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            const errors = screen.getAllByRole('alert');
            expect(errors.length).toBeGreaterThan(0);
        });
    });

    it('should not submit if the recipe title is shorter than 10 characters', async () => {
        const titleInput = screen.getByLabelText(/Titre de la recette/);
        const submitButton = screen.getByRole('button', { name: /Confirmer/ });

        fireEvent.change(titleInput, { target: { value: 'Poulet' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            const errors = screen.getAllByRole('alert');
            expect(errors.length).toBeGreaterThan(0);
        });
    });

    it('should not submit if the recipe title is greater than 100 characters', async () => {
        const titleInput = screen.getByLabelText(/Titre de la recette/);
        const submitButton = screen.getByRole('button', { name: /Confirmer/ });

        fireEvent.change(titleInput, { target: { value: 'Délicieux Poulet rôti aux herbes fraîches et légumes de saison, servi avec une sauce crémeuse onctueuse' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            const errors = screen.getAllByRole('alert');
            expect(errors.length).toBeGreaterThan(0);
        });
    });

    it('should not submit if the recipe title contain unauthorized characters', async () => {
        const titleInput = screen.getByLabelText(/Titre de la recette/);
        const submitButton = screen.getByRole('button', { name: /Confirmer/ });

        fireEvent.change(titleInput, { target: { value: 'Délicieux %Poulet%' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            const errors = screen.getAllByRole('alert');
            expect(errors.length).toBeGreaterThan(0);
        });
    });

    it('should submit if the recipe title is valid', async () => {
        const titleInput = screen.getByLabelText(/Titre de la recette/);
        const submitButton = screen.getByRole('button', { name: /Confirmer/ });

        fireEvent.change(titleInput, { target: { value: 'Délicieux Poulet' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(isRoleAbsent('alert')).toBe(true);
        });
    });

    it('should not submit if the recipe image is invalid', async () => {
        const titleInput = screen.getByLabelText(/Titre de la recette/);
        const imageInput = screen.getByLabelText(/Image de la recette/);
        const submitButton = screen.getByRole('button', { name: /Confirmer/ });

        fireEvent.change(titleInput, { target: { value: 'Délicieux Poulet' } });
        fireEvent.change(imageInput, { target: { files: [] } });

        fireEvent.click(submitButton);

        await waitFor(() => {
            const errors = screen.getAllByRole('alert');
            expect(errors.length).toBeGreaterThan(0);
        });
    });

    it('should submit if the recipe image is valid', async () => {
        const titleInput = screen.getByLabelText(/Titre de la recette/);
        const imageInput = screen.getByLabelText(/Image de la recette/);
        const file = new File(['dummy content'], 'image.png', { type: 'image/png' });
        const submitButton = screen.getByRole('button', { name: /Confirmer/ });

        fireEvent.change(titleInput, { target: { value: 'Délicieux Poulet' } });
        fireEvent.change(imageInput, { target: { files: file } });

        fireEvent.click(submitButton);

        await waitFor(() => {
            const errors = screen.getAllByRole('alert');
            expect(errors.length).toBeGreaterThan(0);
        });
    });
});

export function isRoleAbsent(role: ByRoleMatcher, options?: ByRoleOptions): boolean {
    const element = screen.queryByRole(role, options);
    return element === null;
}
