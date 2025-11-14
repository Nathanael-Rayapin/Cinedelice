import { useNavigate } from "react-router";
import type { IMovieDTO } from "../../interfaces/movie";
import './Movie-Card.scss';

const MovieCard = ({ movie }: { movie: IMovieDTO }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/films/${movie.id}`);
    };

    return (
        <div key={movie.id} className="movie-card" onClick={handleClick}>
            <img src={movie.image} alt={`affiche de ${movie.title}`} className="browse-img" />
            <p>{movie.title}</p>
        </div>
    );
};

export default MovieCard;
