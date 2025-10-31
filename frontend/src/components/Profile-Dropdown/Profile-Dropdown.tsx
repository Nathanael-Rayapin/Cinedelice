import { HiOutlineUserCircle } from "react-icons/hi2";
import './Profile-Dropdown.scss';

const ProfileDropdown = () => {
    return (
        <div className="profile">
            <details className="dropdown dropdown-bottom dropdown-end">
                <summary className="profile-btn btn m-1">
                    <HiOutlineUserCircle size={42} color="#fff" />
                </summary>

                <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                    <li>
                        <label>Connexion</label>
                    </li>
                    <li>
                        <label>Inscription</label>
                    </li>
                </ul>
            </details>
        </div>
    )
}

export default ProfileDropdown