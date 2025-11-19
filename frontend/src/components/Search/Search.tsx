import { IoIosSearch } from 'react-icons/io';
import { useNavigate } from 'react-router';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useSearch } from '../../hooks/useSearch';
import type { ISearchResult } from '../../hooks/useSearch';
import './Search.scss';
// Propriétés du composant Search
interface ISearchProps {
  isMobileOpen: boolean;
  onMobileToggle: (isOpen: boolean) => void;
  isDesktop: boolean;
}
// Composant Search pour la recherche de recettes et de films
const Search = ({ isMobileOpen, onMobileToggle, isDesktop }: ISearchProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ISearchResult[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const { search } = useSearch();

  const dropdownRef = useRef<HTMLDivElement>(null); // Référence pour le dropdown
  const inputRef = useRef<HTMLInputElement>(null); // Référence pour l'input de recherche

  // Centraliser la logique de fermeture / reset
  const closeSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setIsDropdownOpen(false);
    if (!isDesktop) onMobileToggle(false);
  }, [isDesktop, onMobileToggle]);

  // Mettre à jour les résultats avec debounce
  useEffect(() => {
    if (!query.trim()) return;

    const timer = setTimeout(() => {
      const searchResults = search(query).slice(0, 10);
      setResults(searchResults);
      setIsDropdownOpen(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [query, search, closeSearch]);

  // Fermer le dropdown en cliquant en dehors
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        closeSearch();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeSearch]);

  // Reset quand la fenêtre passe sous 769px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 769) {
        resetSearch(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [closeSearch]);

  // Naviguer vers un résultat
  const handleSelectResult = (result: ISearchResult) => {
    closeSearch();

    setTimeout(() => {
      navigate(result.type === 'recipe'
        ? `/recettes/${result.id}`
        : `/films/${result.id}`);
    }, 0);
  };

  // Soumettre le premier résultat si présent
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (results.length > 0) handleSelectResult(results[0]);
  };

  const resetSearch = (closeMobile = false) => {
    setQuery('');
    setResults([]);
    setIsDropdownOpen(false);
    if (closeMobile && !isDesktop) onMobileToggle(false);
  };

  return (
    <div
      className={`search-container ${isMobileOpen && !isDesktop ? 'mobile-open' : ''} ${isDesktop ? 'desktop' : ''}`}
      ref={dropdownRef}
    >
      <form onSubmit={handleSubmit} className="search">
        <input
          ref={inputRef}
          role="searchbox"
          type="search"
          placeholder="Rechercher un plat/film..."
          aria-label="Rechercher un plat ou un film"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setIsDropdownOpen(true)}
        />
        <button type="submit" className="search-btn" aria-label='bouton de recherche'>
          <IoIosSearch size={24} color="#D9D9D9" />
        </button>
      </form>

      {isDropdownOpen && (
        <div className="search-dropdown">
          {results.length > 0 ? (
            results.map((result) => (
              <div
                key={`${result.type}-${result.id}`}
                className="search-result"
                onClick={() => handleSelectResult(result)}
              >
                {result.image && <img src={result.image} alt={result.title} className="result-image" />}
                <div className="result-info">
                  <p className="result-title">{result.title}</p>
                  <p className="result-type">{result.type === 'recipe' ? 'Recette' : 'Film'}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="no-results">Aucun résultat trouvé</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;