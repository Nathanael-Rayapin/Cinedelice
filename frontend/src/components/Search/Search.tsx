import { IoIosSearch } from 'react-icons/io';
import { useNavigate } from 'react-router';
import { useState, useRef, useEffect } from 'react';
import { useSearch } from '../../hooks/useSearch';
import type { ISearchResult } from '../../hooks/useSearch';
import './Search.scss';

interface SearchProps {
  isMobileOpen?: boolean;
  onMobileToggle?: (isOpen: boolean) => void;
  isDesktop?: boolean;
}

const Search = ({ isMobileOpen = false, onMobileToggle, isDesktop = false }: SearchProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ISearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { search } = useSearch();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fermer le dropdown en cliquant en dehors
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus sur l'input au ouverture mobile et réinitialiser à la fermeture
  useEffect(() => {
    if (isMobileOpen && inputRef.current) {
      inputRef.current.focus();
    } else if (!isMobileOpen && !isDesktop) {
      // Réinitialiser quand on ferme la recherche mobile
      setQuery('');
      setResults([]);
      setIsOpen(false);
    }
  }, [isMobileOpen, isDesktop]);

  // Mettre à jour les résultats au changement de query
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim()) {
      const searchResults = search(value);
      setResults(searchResults);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  };

  // Naviguer vers le résultat sélectionné
  const handleSelectResult = (result: ISearchResult) => {
    if (result.type === 'recipe') {
      navigate(`/recettes/${result.id}`);
    } else if (result.type === 'movie') {
      navigate(`/films/${result.id}`);
    }
    // Réinitialiser la recherche
    setQuery('');
    setResults([]);
    setIsOpen(false);
    // Fermer la search en mobile
    if (onMobileToggle && !isDesktop) {
      setTimeout(() => onMobileToggle(false), 0);
    }
  };

  // Soumettre la recherche (navigation optionnelle)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (results.length > 0) {
      handleSelectResult(results[0]);
    }
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
          placeholder="Rechercher un plat..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.trim() && setIsOpen(true)}
        />
        <button type="submit" className="search-btn">
          <IoIosSearch size={24} color="#D9D9D9" />
        </button>
      </form>

      {isOpen && results.length > 0 && (
        <div className="search-dropdown">
          {results.map((result) => (
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
          ))}
        </div>
      )}

      {isOpen && query.trim() && results.length === 0 && (
        <div className="search-dropdown">
          <p className="no-results">Aucun résultat trouvé pour « {query} »</p>
        </div>
      )}
    </div>
  );
};

export default Search;
