import { FaCaretDown } from 'react-icons/fa';
import { useEffect, useRef } from 'react';
import type { ICategoryDTO } from '../../interfaces/category';
import { Link } from 'react-router';
import './Categories-Dropdown.scss';
// Composant CategoriesDropdown pour afficher un menu déroulant des catégories
interface ICategoriesDropdownProps {
  value: string;
  onChange: (value: string) => void;
  categories: ICategoryDTO[];
}
// Composant CategoriesDropdown pour afficher un menu déroulant des catégories
const CategoriesDropdown = ({ value, onChange, categories }: ICategoriesDropdownProps) => {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Si le clique n'est pas sur la dropdown, on ferme la dropdown
      if (detailsRef.current && !detailsRef.current.contains(event.target as Node)) {
        detailsRef.current.removeAttribute('open');
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="categories">
      <details ref={detailsRef} className="dropdown">
        <summary className="categories-btn btn m-1">
          {value || "Catégorie"}
          <FaCaretDown />
        </summary>

        <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
          {categories.map((category) => (
            <>
              <li key={category.id} onClick={() => onChange(category.name)}>
                <input
                  type="radio"
                  name="radio-8"
                  className="radio radio-xs radio-custom-color"
                  checked={value === category.name}
                  readOnly
                />
                <label>{category.name}</label>
              </li>
            </>
          ))}
          <div className="reset-categories">
            <hr />
            <Link
              to="/recettes"
              onClick={() => {
                detailsRef.current?.removeAttribute('open');
              }}>Réinitialiser</Link>
          </div>
        </ul>
      </details>
    </div>
  );
};

export default CategoriesDropdown;
