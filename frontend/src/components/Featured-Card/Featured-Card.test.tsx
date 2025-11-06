import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react'
import FeaturedCard from './Featured-Card';
import { BrowserRouter } from 'react-router';
import type { IRecipeDTO } from '../../interfaces/recipe';

describe('FeaturedCard', () => {
    it('should render', () => {
        const recipe: IRecipeDTO = {
            id: 1,
            category: { name: "Dessert" },
            category_id: 1,
            description: "Un plat de chocolat",
            image: "chocolats.jpg",
            ingredients: "1 kg de chocolat",
            movie_id: 1,
            number_of_person: 4,
            preparation_steps: "Faire cuire le chocolat",
            preparation_time: 30,
            status: "published",
            title: "Chocolats",
            created_at: "2023-03-01T00:00:00.000Z",
            updated_at: "2023-03-01T00:00:00.000Z",
            user_id: 1,
            user: { username: "John" }
        }

        const { container } = render(
            <BrowserRouter>
                <FeaturedCard recipe={recipe} />
            </BrowserRouter>
        );

        const card = container.querySelector('.featured-card');
        expect(card).toBeInTheDocument();

        const badge = container.querySelector('.badge');
        expect(badge).toBeInTheDocument();

        const likes = container.querySelector('.likes');
        expect(likes).toBeInTheDocument();
    });
})