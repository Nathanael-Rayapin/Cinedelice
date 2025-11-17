import { useContext, useEffect, useState } from 'react';
import { getProfile } from '../../services/auth.service';
import TabBar from '../../components/Tab-Bar/Tab-Bar';
import { NavLink, Outlet } from 'react-router';
import type { IProfileDTO } from '../../interfaces/user';
import { GlobalUIContext } from '../../store/interface';
import './Profile.scss';

const Profile = () => {
  const [profile, setProfile] = useState<IProfileDTO | null>(null);
  const { setLoading, setErrorMsg } = useContext(GlobalUIContext);

  const tabs = ['Mes recettes', 'Mes informations'];

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

  return (
    profile && (
      <div className="profile-container">
        <h1 className="username">{profile.user.username}</h1>
        <div className="tabs">
          <TabBar tabs={tabs} />
          <NavLink
            to="/profil/ajouter-recette"
            className={({ isActive }) => isActive ? "btn add-recipe-btn active" : "btn add-recipe-btn"}
          >
            Ajouter une recette
          </NavLink>
        </div>
        <Outlet />
      </div>
    )
  );
};

export default Profile;
