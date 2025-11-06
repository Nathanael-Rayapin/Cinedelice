import Search from '../Search/Search';
import ProfileDropdown from '../Profile-Dropdown/Profile-Dropdown';
import BurgerMenuDropdown from '../Burger-Menu-Dropdown/Burger-Menu-Dropdown';
import CategoriesDropdown from '../Categories-Dropdown/Categories-Dropdown';
import { IoIosSearch } from "react-icons/io";
import logo from '../../assets/logo.svg';
import { NavLink } from 'react-router';
import './Navbar.scss';

const Navbar = () => {
  return (
    <header>
      <nav className='navbar'>
        <div className="brand">
          <BurgerMenuDropdown />
          <NavLink to="/">
            <img src={logo} alt="Logo" />
          </NavLink>
        </div>
        <div className="filters">
          <CategoriesDropdown />
          <Search />
        </div>
        <div className="sections">
          <a href="/recettes">Recettes</a>
          <a href="/films">Films</a>
          <ProfileDropdown />
          <IoIosSearch className='search-btn' size={40} color="#FB8B24" />
        </div>
      </nav>
    </header>
  );
}

export default Navbar