import type { IMovieProps } from "../../interfaces/movie";
import './Movie-Card.scss';

const MovieCard = ({ movie }: { movie: IMovieProps }) => {
    return (
        <div key={movie.id} className="movie-card">
            <img src={movie.img} alt={`affiche de ${movie.title}`} />
            <p>{movie.title}</p>
        </div>
    )
}

export default MovieCard