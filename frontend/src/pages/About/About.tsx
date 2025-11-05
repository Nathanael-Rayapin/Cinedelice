import './About.scss';
import { useEffect } from 'react';
import logo from '../../assets/logo.svg';

import maxiburger from '../../assets/images/maxiburger.png';
import director from '../../assets/images/director.jpg';
import chefHat from '../../assets/images/chef-hat.webp';

const About = () => {
    // Remet la page en haut au chargement du composant
     useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  return (
    <div className="about-page">

      {/* Section d’en-tête */}
      <header className="about-header">
        <img src={logo} alt="CinéDélices Logo" className="about-logo" />
        <h1>CinéDélices</h1>
        <p className='title'>Quand la passion du cinéma rencontre celle de la cuisine 🍿🍽️</p>
      </header>

      {/* Section histoire */}
      <section className="about-section">
        <div className="about-img-container">
          <img src={maxiburger} alt="burger géant" className="about-img" id='burger'/>
        </div>
        <div className="about-text">
          <h2>Notre Histoire</h2>
          <p>
           CinéDélices, c’est l’histoire de quatre amis qui ont un peu trop regardé de films…
            et un peu trop mangé devant. Nathanaël, Luc, Mehdi et Christophe : quatre passionnés
            de cinéma, de cuisine, et de débats interminables sur « quel est le meilleur plat de film ? »
            (spoiler : personne n’est d’accord, même encore aujourd’hui).
          </p>
          <p>
            Un soir, devant <em>Pulp fiction</em>, l’un d’eux a lancé : <strong>“Et si on reproduisait les recettes des films ?”</strong><br />
            20 minutes plus tard, ils étaient dans la cuisine. <br /> 
            2 heures plus tard, ils nettoyaient encore.
          </p>
          <p>Après plusieurs expériences culinaires plus ou moins réussies (RIP la crème brûlée 
            façon <em>Amélie Poulain</em>, qui a fini en flamme comme si on tournait un film de Michael Bay),
            ils ont décidé de créer <strong>CinéDélices</strong> : un site où les recettes inspirées du cinéma 
            et des séries trouvent une place d’honneur.</p>
        </div>
      </section>

      {/* Section fondateurs */}
      <section className="about-section founders">
        <div className="about-text">
          <h2>Les Fondateurs 🎬👨‍🍳</h2>
          <ul>
            <li><strong>Nathanaël</strong> — Le directeur de casting des recettes. S'il dit que ça passe à l’écran, ça passe.</li>
            <li><strong>Luc</strong> — Le styliste culinaire. La présentation, c’est sacré.</li>
            <li><strong>Mehdi</strong> — Le goûteur officiel. Son “hmm” vaut un Oscar.</li>
            <li><strong>Christophe</strong> — La mémoire vivante du cinéma. Il cite des répliques pendant qu'il coupe des oignons.</li>
          </ul>
        </div>
        <div className="about-img-container">
          <img src={chefHat} alt="Chef Hat" className="about-img" />
        </div>
      </section>

      {/* Section ambiance cinéma */}
      <section className="about-section">
        <div className="about-img-container">
          <img src={director} alt="Clap Cinéma" className="about-img" />
        </div>
        <div className="about-text">
          <h2>Notre Mission</h2>
          <p>
            Faire découvrir, cuisiner et partager les plats cultes du grand écran.
            Chez CinéDélices, chaque recette raconte une histoire, chaque plat est une scène,
            et chaque repas mérite un générique de fin.
          </p>
          <p>
            Installez-vous, enfilez votre tablier, et 🎥 <strong> Action !</strong>
          </p>
        </div>
      </section>

    </div>
  );
};

export default About;

