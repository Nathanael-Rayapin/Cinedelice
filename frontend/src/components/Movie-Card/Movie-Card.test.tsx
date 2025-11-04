import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react'
import MovieCard from './Movie-Card';
import { BrowserRouter } from 'react-router';
import charlieEtLaChocolaterie from "../../assets/images/chocolats.jpg";

describe('MovieCard', () => {
    it('should render', () => {
        const movie = {
            id: 1,
            img: charlieEtLaChocolaterie,
            title: "Charlie et la chocolaterie",
        }

        const { container } = render(
            <BrowserRouter>
                <MovieCard movie={movie} />
            </BrowserRouter>
        );

        const card = container.querySelector('.movie-card');
        expect(card).toBeInTheDocument();
    });
})