import './Burger-Menu-Dropdown.scss';

const BurgerMenuDropdown = () => {
  return (
    <div className="burger-menu">
      <details className="dropdown">
        <summary className="btn m-1 btn-circle swap swap-rotate">
          <svg
            className="swap-off fill-current"
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 512 512"
          >
            <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
          </svg>
        </summary>
        <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
          <li>
            <a href="/recettes">Recettes</a>
          </li>
          <li>
            <a href="/films">Films</a>
          </li>
        </ul>
      </details>
    </div>
  );
};

export default BurgerMenuDropdown;
