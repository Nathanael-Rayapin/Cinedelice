import { NavLink, useLocation } from 'react-router';
import { formatTabPath } from '../../utils/utils';
import './Tab-bar.scss';
// Composant TabBar pour la navigation par onglets
const TabBar = ({ tabs }: { tabs: string[] }) => {
  const location = useLocation().pathname;
// Extraire le chemin de base pour les onglets
  const parts = location.split('/');
  const basePath = parts.length > 2 ? `/${parts[1]}` : '';
// Rendu des onglets avec liens de navigation
  return (
    <ul className="tab-bar">
      {tabs.map((tab, index) => {
        return (
          <li key={index}>
            <NavLink
              to={formatTabPath(tab, basePath)}
              className={({ isActive }) => isActive ? "btn m-1 active" : "btn m-1"}
            >
              {tab}
            </NavLink>
          </li>
        );
      })}
    </ul>
  );
};

export default TabBar;
