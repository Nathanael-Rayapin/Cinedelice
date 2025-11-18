import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import MovieCard from './Movie-Card';
import { BrowserRouter } from 'react-router';

describe('MovieCard', () => {
  const movie = {
    id: 1,
    id_movie_tmdb: 1,
    title: 'Charlie et la chocolaterie',
    synopsis: 'Le jeune Charlie Bucket gagne une visite de la plus incroyable et mystérieuse usine de chocolat du monde, dirigée par l\'excentrique Willy Wonka.',
    image: "",
    release_year: '12.12.1972',
    director: 'Francis Ford Coppola',
  }

  it('should render', () => {
    const { container } = render(
      <BrowserRouter>
        <MovieCard movie={movie} />
      </BrowserRouter>
    );

    const card = container.querySelector('.movie-card');
    expect(card).toBeInTheDocument();
  });
});
