import './Home.scss'
import burger1 from "../assets/images/burger1.jpg";
import clap from "../assets/images/clap.png";
import auteur from "../assets/images/auteur.png";
import minuteur from "../assets/images/minuteur.png";
import coeur from "../assets/images/coeur.png";
import commentaires from "../assets/images/commentaires.png";

const Home = () => {
    return (
        <div className="home">
            <div className='mini-navbar'>               
              <h3 id='tag-1'>Pour vous</h3>
              <h3 id='tag-2'>Tendance</h3>
              <h3 id='tag-3'>Favoris</h3>
            </div>

            <div className="recipe-card">
                <img src={burger1} alt="photo du burger" className='bg-img' />
                <div className="recipe-content">
                    <h2>Burger de Mehdi</h2>

                    <div className="recipe-infos">
                    <img src={clap} alt="film" /><p>Pulp Fiction</p>
                    
                    <img src={auteur} alt="auteur de la recette" /><p>Par Mehdi</p>
                    
                    <img src={minuteur} alt="temps de préparation" /><p>45 min</p>
                    </div>

                    <div className="recipe-footer">
                    <div className="icons">
                        <img src={coeur} alt="nombre de likes" /><p>1 647</p>
                        <img src={commentaires} alt="nombre de commentaires" /><p>1 647</p>
                    </div>
                    <button>Voir la recette</button>
                    </div>
                </div>
                </div>
        </div>
    )
}

export default Home