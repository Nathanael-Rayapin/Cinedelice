import CategoriesDropdown from '../Categories-Dropdown/Categories-Dropdown';
import Search from '../Search/Search';
import logo from '../../assets/logo.svg';
import './Navbar.scss';
import ProfileDropdown from '../Profile-Dropdown/Profile-Dropdown';

const Navbar = () => {
  return (
    <header>
      <nav className='navbar'>
        <div className="brand">
          <a href="#">
            <img src={logo} alt="Logo" />
          </a>
        </div>
        <div className="filters">
          <CategoriesDropdown />
          <Search />
        </div>
        <div className="sections">
          <a href="#">Recettes</a>
          <a href="#">Films</a>
          <ProfileDropdown />
        </div>
      </nav>
    </header>
  );
}

export default Navbar