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
import { useContext, useEffect, useState } from 'react';
import { GlobalUIContext } from '../../store/interface';
import { getCategories } from '../../services/categories.service';
import type { ICategoryDTO } from '../../interfaces/category';
import './Navbar.scss';

const Navbar = () => {
    const { setLoading, setErrorMsg } = useContext(GlobalUIContext);
    const [categories, setCategories] = useState<ICategoryDTO[]>([]);

  useEffect(() => {
      const fetchCategories = async () => {
        try {
          setLoading(true);
          const categories = await getCategories();
          setCategories(categories);
        } catch (error) {
          if (error instanceof Error) {
            setErrorMsg(error.message);
          }
        } finally {
          setLoading(false);
        }
      };
  
      fetchCategories();
    }, []);

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
          <CategoriesDropdown value="" onChange={() => { }} categories={categories} />
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
