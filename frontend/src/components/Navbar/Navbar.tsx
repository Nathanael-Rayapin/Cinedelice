import Search from '../Search/Search';
import ProfileDropdown from '../Profile-Dropdown/Profile-Dropdown';
import BurgerMenuDropdown from '../Burger-Menu-Dropdown/Burger-Menu-Dropdown';
import CategoriesDropdown from '../Categories-Dropdown/Categories-Dropdown';
import { IoIosSearch } from 'react-icons/io';
import logo from '../../assets/logo.svg';
import { NavLink } from 'react-router';
import { useState, useEffect } from 'react';
import './Navbar.scss';

const Navbar = () => {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  // Fermer la recherche au changement de breakpoint
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 769) {
        setIsMobileSearchOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen);
  };

  return (
    <header>
      <nav className="navbar">
        <div className="brand">
          <BurgerMenuDropdown />
          <NavLink to="/">
            <img src={logo} alt="Logo" />
          </NavLink>
        </div>
        <div className="filters">
          <CategoriesDropdown />
          <Search isMobileOpen={false} onMobileToggle={setIsMobileSearchOpen} isDesktop />
          {/* <CategoriesDropdown /> */}
          <Search />
        </div>
        <div className="sections">
          <NavLink to="/recettes">Recettes</NavLink>
          <NavLink to="/films">Films</NavLink>
          <ProfileDropdown />
          {!isMobileSearchOpen && (
            <button
              type="button"
              className="search-btn"
              onClick={toggleMobileSearch}
              aria-label="Ouvrir la recherche"
            >
              <IoIosSearch size={40} color="#FB8B24" />
            </button>
          )}
          {isMobileSearchOpen && (
            <Search
              isMobileOpen={isMobileSearchOpen}
              onMobileToggle={setIsMobileSearchOpen}
              isDesktop={false}
            />
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
