import Search from '../Search/Search';
import ProfileDropdown from '../Profile-Dropdown/Profile-Dropdown';
import BurgerMenuDropdown from '../Burger-Menu-Dropdown/Burger-Menu-Dropdown';
import CategoriesDropdown from '../Categories-Dropdown/Categories-Dropdown';
import { IoIosSearch } from 'react-icons/io';
import logo from '../../assets/logo.svg';
import { NavLink } from 'react-router';
import { useContext, useEffect, useState } from 'react';
import { GlobalUIContext } from '../../store/interface';
import { getCategories } from '../../services/categories.service';
import type { ICategoryDTO } from '../../interfaces/category';
import { useLocation, useNavigate } from 'react-router';
import './Navbar.scss';
// Composant Navbar pour la navigation principale
const Navbar = () => {
    const [categories, setCategories] = useState<ICategoryDTO[]>([]);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const { setLoading, setErrorMsg } = useContext(GlobalUIContext);

  // Fermer la recherche mobile lors du redimensionnement de la fenêtre
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 769) {
        setIsMobileSearchOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Navigation
  const navigate = useNavigate();
  const location = useLocation();
  // Récupérer la catégorie active depuis l'URL (ex: /recettes?categorie=Dessert)
  const searchParams = new URLSearchParams(location.search);
  const activeCategory = searchParams.get('categorie') || '';

  // Récupérer les catégories pour le dropdown
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
          <CategoriesDropdown
            value={activeCategory}
            onChange={(categoryName: string) => {
              // Naviguer vers la page recettes avec le paramètre de catégorie
              navigate(`/recettes?categorie=${encodeURIComponent(categoryName)}`);
            }}
            categories={categories}
          />
          {activeCategory && (
            <button
              type="button"
              className="btn btn-ghost reset-category-btn"
              onClick={() => navigate('/recettes')}
              title="Réinitialiser le filtre"
            >
              Toutes
            </button>
          )}
          <Search isMobileOpen={false} onMobileToggle={setIsMobileSearchOpen} isDesktop={true} />
        </div>
        <div className="sections">
          <NavLink to="/recettes">Recettes</NavLink>
          <NavLink to="/films">Films</NavLink>
          <ProfileDropdown />
          {!isMobileSearchOpen && (
            <button
              type="button"
              className="search-btn"
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              aria-label="Ouvrir la recherche"
            >
              <IoIosSearch size={40} color="#FB8B24" />
            </button>
          )}
          {isMobileSearchOpen && (
            <Search
              isMobileOpen={true}
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
