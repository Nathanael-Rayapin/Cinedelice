import { HiOutlineUserCircle } from "react-icons/hi2";
import './Profile-Dropdown.scss';
import { NavLink } from "react-router";
import { useEffect, useRef } from "react";

const ProfileDropdown = () => {
    const detailsRef = useRef<HTMLDetailsElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Si le clique n'est pas sur la dropdown, on ferme la dropdown
            if (detailsRef.current && !detailsRef.current.contains(event.target as Node)) {
                detailsRef.current.removeAttribute("open");
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    // On ferme la dropdown lorsque l'utilisateur clique "Connexion" ou "Inscription"
    const handleClose = () => {
        detailsRef.current?.removeAttribute("open");
    };

    return (
        <div className="profile">
            <details ref={detailsRef} className="dropdown dropdown-bottom dropdown-end">
                <summary className="profile-btn btn m-1">
                    <HiOutlineUserCircle size={42} color="#fff" />
                </summary>

                <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                    <li>
                        <NavLink to="/connexion"
                            className={({ isActive }) => isActive ? "active" : ""}
                         onClick={handleClose}>
                            Connexion
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/inscription"
                            className={({ isActive }) => isActive ? "active" : ""}
                         onClick={handleClose}>
                            Inscription
                        </NavLink>
                    </li>
                </ul>
            </details>
        </div>
    )
}

export default ProfileDropdown