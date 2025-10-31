import { IoIosSearch } from "react-icons/io";
import './Search.scss';

const Search = () => {
    return (
        <label className="search">
            <input type="search" required placeholder="Rechercher un plat..." />
            <IoIosSearch size={24} color="#D9D9D9" />
        </label>
    )
}

export default Search