import './Home.scss'
import clap from "../assets/images/clap.png";
import auteur from "../assets/images/auteur.png";
import minuteur from "../assets/images/minuteur.png";
import coeur from "../assets/images/coeur.png";
import commentaires from "../assets/images/commentaires.png";
// photos de recettes
import burger1 from "../assets/images/burger1.jpg";
import chocolats from "../assets/images/chocolats.jpg";
import ramen from "../assets/images/ramen.jpg";
import applePie from "../assets/images/apple_pie.webp";
import bieraubeurre from "../assets/images/bieraubeurre.jpg";
import carbonade from "../assets/images/carbonade.webp";
import kahunaBurger from "../assets/images/kahuna_burger.jpg";
import soupeAuxChoux from "../assets/images/soupe_aux_choux.webp";
import spaghetti from "../assets/images/spaghetti_bolognaise.webp";
// affiches de films
import ratatouilleFilm from "../assets/images/ratatouille_film.jpg";
import charlieEtLaChocolaterie from "../assets/images/charlie-et-la-chocolaterie.jpg";
import pulpFiction from "../assets/images/pulp_fiction.jpg";
import leParrain from "../assets/images/le_parrain.jpg";

const Home = () => {
    // Données des recettes
    const recipes = [
        { id: 1, img: chocolats, title: "Chocolats", author: "Luc", likes: 1647, badge: "dessert" },
        { id: 2, img: ramen, title: "Ramen", author: "Rachel", likes: 2453, badge: "plat" },
        { id: 3, img: applePie, title: "Apple Pie", author: "Marie", likes: 1823, badge: "dessert" },
        { id: 4, img: bieraubeurre, title: "Bière au beurre", author: "Harry", likes: 3102, badge: "plat" },
        { id: 5, img: carbonade, title: "Carbonade", author: "Pierre", likes: 1456, badge: "plat" },
        { id: 6, img: kahunaBurger, title: "Kahuna Burger", author: "Vincent", likes: 2789, badge: "plat" },
        { id: 7, img: soupeAuxChoux, title: "Soupe aux choux", author: "Claude", likes: 987, badge: "plat" },
        { id: 8, img: spaghetti, title: "Spaghetti Bolognaise", author: "Luigi", likes: 4521, badge: "plat" }
    ];

    // Données des films
    const movies = [
        { id: 1, img: ratatouilleFilm, title: "Ratatouille" },
        { id: 2, img: charlieEtLaChocolaterie, title: "Charlie et la chocolaterie" },
        { id: 3, img: pulpFiction, title: "Pulp Fiction" },
        { id: 4, img: leParrain, title: "Le Parrain" }
    ];

    return (
        <div className="home">
            <div className='mini-navbar'>               
              <h3 id='tag-1'>Pour vous</h3>
              <h3 id='tag-2'>Tendance</h3>
              <h3 id='tag-3'>Favoris</h3>
            </div>

            {/* recette aléatoire */}
            <div className="recipe-card">
                <img src={burger1} alt="photo du burger" className='bg-img' />
                <div className="recipe-content">
                    <h1>Burger de Mehdi</h1>

                    <div className="recipe-infos">
                        <div className="info-item">
                            <img src={clap} alt="film" /><p>Pulp Fiction</p>
                        </div>
                        <div className="info-item">
                            <img src={auteur} alt="auteur" /><p>Par Mehdi</p>
                        </div>
                        <div className="info-item">
                            <img src={minuteur} alt="temps" /><p>45 min</p>
                        </div>
                    </div>

                    <div className="recipe-footer">
                        <div className="icons">
                            <div className="icon-item">
                                <img src={coeur} alt="likes" /><p>1 647</p>
                            </div>
                            <div className="icon-item">
                                <img src={commentaires} alt="commentaires" /><p>1 647</p>
                            </div>
                        </div>
                        <button>Voir la recette</button>
                    </div>
                </div>
            </div>

             {/* Section "Recettes à la une" */}
            <h2 className='recipe-section-title'>Recettes à la une</h2>
            <section className="featured-recipes">
                {recipes.map((recipe) => (
                    <div key={recipe.id} className="featured-card">
                        <img src={recipe.img} alt={recipe.title} className="featured-img" />
                        <div className="featured-body">
                            <h3>{recipe.title}</h3>
                            <p className="author">{recipe.author}</p>
                            <div className="featured-footer">
                                <div className="likes">
                                    <img src={coeur} alt="likes" />
                                    <span>{recipe.likes.toLocaleString()}</span>
                                </div>
                                <span className={`badge ${recipe.badge}`}>
                                    {recipe.badge.charAt(0).toUpperCase() + recipe.badge.slice(1)}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            {/* Section "Parcourir par films" */}
            <div className="browse-section">
                <div className="browse-header">
                    <h2>Parcourir par films</h2>
                    <a href="#">Tout voir</a>
                </div>

                <div className="browse-list">
                    {movies.map((movie) => (
                        <div key={movie.id} className="browse-card">
                            <img src={movie.img} alt={`affiche de ${movie.title}`} className="browse-img" />
                            <div className="browse-overlay">
                                <p>{movie.title}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
         </div>   
    );
}

export default Home