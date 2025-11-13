import { useEffect, useState } from "react";
import type { IProfileDTO } from "../../interfaces/auth";
import PacmanLoader from "react-spinners/PacmanLoader";
import { getProfile } from "../../services/auth.service";
import TabBar from "../../components/Tab-Bar/Tab-Bar";
import { Outlet } from "react-router";
import "./Profile.scss";

const Profile = () => {
    const [profile, setProfile] = useState<IProfileDTO | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const tabs = ['Mes recettes', 'Mes informations'];

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const profile = await getProfile();
                setProfile(profile);
            } catch (error) {
                setErrorMsg(error instanceof Error ? error.message : "Une erreur est survenue.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="loading-container" aria-label='Chargement des recettes'>
                <PacmanLoader color="#fB8b24" />
            </div>
        );
    }

    if (errorMsg) {
        return (
            <div className="error-container">
                <p className="error-msg">{errorMsg}</p>
            </div>
        );
    }

    return profile &&
        <div className="profile-container">
            <h1 className="username">{profile.user.username}</h1>
            <div className="tabs">
                <TabBar tabs={tabs} />
            </div>
            <Outlet />
        </div>
        ;
};

export default Profile;