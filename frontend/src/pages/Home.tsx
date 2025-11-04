import './Home.scss'
import burger1 from "../assets/images/burger1.jpg";
import clap from "../assets/images/clap.png";
import auteur from "../assets/images/auteur.png";
import minuteur from "../assets/images/minuteur.png";
import coeur from "../assets/images/coeur.png";
import commentaires from "../assets/images/commentaires.png";
import chocolats from "../assets/images/chocolats.jpg";
import ramen from "../assets/images/ramen.jpg";
import ratatouille_film from "../assets/images/ratatouille_film.jpg";
import charlie_et_la_chocolaterie from "../assets/images/charlie-et-la-chocolaterie.jpg";

const Home = () => {
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
            <h2>Recettes à la une</h2>
            <div className="featured-recipes">
                <div className="featured-card">
                    <img src={chocolats} alt="Chocolats" className="featured-img" />
                    <div className="featured-body">
                        <h3>Chocolats</h3>
                        <p className="author">Luc</p>
                        <div className="featured-footer">
                            <div className="likes">
                                <img src={coeur} alt="likes" />
                                <span>1 647</span>
                            </div>
                            <span className="badge dessert">Dessert</span>
                        </div>
                    </div>
                </div>

                <div className="featured-card">
                    <img src={ramen} alt="Ramen" className="featured-img" />
                    <div className="featured-body">
                        <h3>Ramen</h3>
                        <p className="author">Rachel</p>
                        <div className="featured-footer">
                            <div className="likes">
                                <img src={coeur} alt="likes" />
                                <span>2 453</span>
                            </div>
                            <span className="badge plat">Plat</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section "Parcourir par films" */}
            <div className="browse-section">
                <div className="browse-header">
                    <h2>Parcourir par films</h2>
                    <a href="#">Tout voir</a>
                </div>

                <div className="browse-list">
                    <div className="browse-card">
                        <img src={ratatouille_film} alt="affiche de Ratatouille" className="browse-img" />
                        <div className="browse-overlay">
                            <p>Ratatouille</p>
                        </div>
                    </div>

                    <div className="browse-card">
                        <img src={charlie_et_la_chocolaterie} alt="Charlie et la chocolaterie" className="browse-img" />
                        <div className="browse-overlay">
                            <p>Charlie et la chocolaterie</p>
                        </div>
                    </div>
                </div>
            </div>
         </div>   
    
)}

export default Home