import { Link, useLocation } from 'react-router';
import { formatTabPath } from '../../utils/utils';
import './Tab-bar.scss';

// Il reçoit une liste d'onglets ("tabs") sous forme de tableau de chaînes de caractères
// Exemple : ["Pour vous", "Tendances", "Favoris"]
// C'est le parent qui lui donne la liste, je peux très bien avoir un parent qui lui
// donne ["Mes informations", "Mes recettes"]
const TabBar = ({ tabs }: { tabs: string[] }) => {

    // useLocation() permet d'accéder à l'URL actuelle
    // Ici, on extrait uniquement le chemin ("pathname") qui est "/pour-vous"
    const location = useLocation().pathname;

    return (
        <ul className='tab-bar'>
            {/* 
                On parcourt chaque élément du tableau `tabs` avec .map().
                Exemple :
                - tab = "Pour vous"
                - index = 0

                - tab = "Tendances"
                - index = 1

                - tab = "Favoris"
                - index = 2
            */}
            {tabs.map((tab, index) => {

                // Pour chaque tab, on crée un <li> (élément de liste)
                // Si la page actuelle correspond à l’URL du tab, on lui ajoute la classe "active"
                // La classe "active" va donner au <li> un fond orange
                return <li
                    key={index}
                    className={location === formatTabPath(tab) ? 'active' : ''}
                >
                    {/* 
                        On place un bouton dans le "li", à l’intérieur, on met un <Link> de React Router
                        qui permet de naviguer vers la page correspondante sans recharger le site
                        
                        Exemple :
                        Si tab = "Pour vous"
                        alors le lien va vers "/pour-vous"
                        et quand on va vers "/pour-vous", on va sur la page "Home" (défini dans le fichier App.tsx)
                    */}
                    <button className='btn m-1'>
                        <Link to={formatTabPath(tab)}>{tab}</Link>
                    </button>
                </li>
            })}
        </ul>
    )
}

export default TabBar