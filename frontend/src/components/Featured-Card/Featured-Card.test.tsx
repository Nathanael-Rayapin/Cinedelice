import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react'
import FeaturedCard from './Featured-Card';
import { BrowserRouter } from 'react-router';
import chocolats from "../../assets/images/chocolats.jpg";

describe('FeaturedCard', () => {
    it('should render', () => {
        const recipe = {
            id: 1,
            img: chocolats,
            title: "Chocolats",
            duration: "45 min",
            author: "Luc",
            likes: 1647,
            comment: 45,
            badge: "dessert"
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