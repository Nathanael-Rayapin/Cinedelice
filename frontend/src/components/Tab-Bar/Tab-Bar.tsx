import { NavLink, useLocation } from 'react-router';
import { formatTabPath } from '../../utils/utils';
import { useContext } from 'react';
import { AuthContext } from '../../store/interface';
import './Tab-bar.scss';

export interface TabConfig {
  label: string;
  path: string;
  useBasePath?: boolean;
}

interface ITabBarProps {
  tabs: TabConfig[];
}

const TabBar = ({ tabs }: ITabBarProps) => {
  const { role } = useContext(AuthContext);
  const location = useLocation().pathname;

  // Récupérer le basePath si nécessaire
  const parts = location.split('/');
  const basePath = parts.length > 2 ? `/${parts[1]}` : '';

  return (
    <ul className="tab-bar" style={role === "admin" ? { maxWidth: "500px" } : { maxWidth: "350px" }}>
      {tabs.map((tab, index) => {

        const shouldUseBase = tab.useBasePath !== false;
        const finalPath = shouldUseBase ? formatTabPath(tab.path, basePath) : tab.path;

        return (
          <li key={index}>
            <NavLink
              to={finalPath}
              className={({ isActive }) => isActive ? "btn m-1 active" : "btn m-1"}
            >
              {tab.label}
            </NavLink>
          </li>
        );
      })}
    </ul>

  );
};

export default TabBar;
