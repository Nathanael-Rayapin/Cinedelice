import { useContext, useEffect, useState } from 'react';
import { getProfile } from '../../services/auth.service';
import TabBar from '../../components/Tab-Bar/Tab-Bar';
import { Outlet } from 'react-router';
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
        </div>
        <Outlet />
      </div>
    )
  );
};

export default Profile;
