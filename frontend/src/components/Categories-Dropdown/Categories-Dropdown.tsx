import { FaCaretDown } from "react-icons/fa";
import { useEffect, useRef } from "react";
import './Categories-Dropdown.scss';

const CategoriesDropdown = () => {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Si le clique n'est pas sur la dropdown, on ferme la dropdown
      if (detailsRef.current && !detailsRef.current.contains(event.target as Node)) {
        detailsRef.current.removeAttribute("open");
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="categories">
      <details ref={detailsRef} className="dropdown">
        <summary className="categories-btn btn m-1">
          Categories
          <FaCaretDown />
        </summary>

        <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
          <li>
            <input type="checkbox" defaultChecked className="checkbox checkbox-sm checked:border-orange-500 checked:bg-orange-400 checked:text-orange-800" />
            <label>Entrées</label>
          </li>
          <li>
            <input type="checkbox" defaultChecked className="checkbox checkbox-sm checked:border-orange-500 checked:bg-orange-400 checked:text-orange-800" />
            <label>Plats</label>
          </li>
          <li>
            <input type="checkbox" defaultChecked className="checkbox checkbox-sm checked:border-orange-500 checked:bg-orange-400 checked:text-orange-800" />
            <label>Desserts</label>
          </li>
        </ul>
      </details>
    </div>
  )
}

export default CategoriesDropdown