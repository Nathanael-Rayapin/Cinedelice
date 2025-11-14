import { useLocation, useNavigate } from 'react-router';
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
  const navigate = useNavigate();

  // Exemple :
  // - si location = "/profil/mes-recettes"
  // → basePath = "/profil"
  // - si location = "/pour-vous"
  // → basePath = ""
  const parts = location.split('/');
  const basePath = parts.length > 2 ? `/${parts[1]}` : '';

  return (
    <ul className="tab-bar">
      {tabs.map((tab, index) => {
        const tabPath = formatTabPath(tab, basePath);

        // Pour chaque tab, on crée un <li> (élément de liste)
        // Si la page actuelle correspond à l’URL du tab, on lui ajoute la classe "active"
        // La classe "active" va donner au <li> un fond orange
        return (
          <li key={index} className={location === tabPath ? 'active' : ''}>
            {/* 
                        On place un bouton dans le "li", à l’intérieur, on met un <Link> de React Router
                        qui permet de naviguer vers la page correspondante sans recharger le site
                        
                        Exemple :
                        Si tab = "Pour vous"
                        alors le lien va vers "/pour-vous"
                        et quand on va vers "/pour-vous", on va sur la page "Home" (défini dans le fichier App.tsx)
                    */}
            <button
              className="btn m-1"
              onClick={() => {
                // Ne navigue pas pour "Tendances" et "Favoris"
                if (['/tendances', '/favoris'].includes(tabPath)) return;
                navigate(tabPath);
              }}
            >
              {tab}
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default TabBar;
