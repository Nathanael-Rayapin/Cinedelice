import logo from '../../assets/logo.svg';
import { NavLink } from 'react-router';
import './Footer.scss';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">

        <NavLink to="/">
          <img src={logo} alt="Logo" />
        </NavLink>
        <p className="footer-copyright">©Copyright 2025</p>

        <nav>
          <NavLink to="/cgu">CGU</NavLink>
          <NavLink to="/à-propos">À propos</NavLink>
        </nav>

      </div>
    </footer>
  );
};

export default Footer;