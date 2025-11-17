import { FaCaretDown } from 'react-icons/fa';
import { useEffect, useRef } from 'react';
import './Categories-Dropdown.scss';

interface ICategoriesDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

const CategoriesDropdown = ({ value, onChange }: ICategoriesDropdownProps) => {
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
          Categories
          <FaCaretDown />
        </summary>

        <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
          <li onClick={() => onChange("Entrées")}>
            <input
              type="radio"
              name="radio-8"
              className="radio radio-sm radio-custom-color"
              checked={value === "Entrées"}
              readOnly />
            <label>Entrées</label>
          </li>
          <li onClick={() => onChange("Plats")}>
            <input
              type="radio"
              name="radio-8"
              className="radio radio-sm radio-custom-color"
              checked={value === "Plats"}
              readOnly />
            <label>Plats</label>
          </li>
          <li onClick={() => onChange("Desserts")}>
            <input
              type="radio"
              name="radio-8"
              className="radio radio-sm radio-custom-color"
              checked={value === "Desserts"}
              readOnly />
            <label>Desserts</label>
          </li>
        </ul>
      </details>
    </div>
  );
};

export default CategoriesDropdown;
