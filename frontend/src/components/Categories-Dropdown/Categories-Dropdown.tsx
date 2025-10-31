import { FaCaretDown } from "react-icons/fa";
import './Categories-Dropdown.scss';

const CategoriesDropdown = () => {
  return (
    <div className="categories">
            <details className="dropdown">
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