import { useContext, useEffect, useState } from 'react';
import { getProfile } from '../../services/auth.service';
import TabBar, { type TabConfig } from '../../components/Tab-Bar/Tab-Bar';
import { NavLink, Outlet } from 'react-router';
import type { IProfileDTO } from '../../interfaces/user';
import { AuthContext, GlobalUIContext } from '../../store/interface';
import './Profile.scss';

// Composant Profile affichant le profil utilisateur avec ses recettes et informations
const Profile = () => {
  const [profile, setProfile] = useState<IProfileDTO | null>(null);
  const { setLoading, setErrorMsg } = useContext(GlobalUIContext);
  const { role } = useContext(AuthContext);

  // sélectionner le profil de l'utilisateur
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profile = await getProfile();
        setProfile(profile);
      } catch (error) {
        setErrorMsg(error instanceof Error ? error.message : 'Une erreur est survenue.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const buildTabsByRole = (): TabConfig[] => {
    if (role === "admin") {
      return [
        { label: 'Mes recettes', path: 'mes-recettes' },
        { label: 'Mes informations', path: 'mes-informations' },
        { label: 'Espace Admin', path: '/espace-admin', useBasePath: false }
      ];
    }

    return [
      { label: 'Mes recettes', path: 'mes-recettes' },
      { label: 'Mes informations', path: 'mes-informations' }
    ];
  };

  return (
    profile && (
      <div className="profile-container">
        <h1 className="username">{profile.user.username}</h1>
        <div className="tabs">
          <TabBar tabs={buildTabsByRole()} />
          <NavLink
            to="/profil/ajouter-recette"
            className={({ isActive }) => isActive ? "btn add-recipe-btn active" : "btn add-recipe-btn"}
          >
            Nouvelle recette
          </NavLink>
        </div>
        <Outlet />
      </div>
    )
  );
};

export default Profile;
